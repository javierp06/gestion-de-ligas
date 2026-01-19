// API Plugin with Advanced Interceptors, Auto-Refresh, Retry Logic & Global Error Handling
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const toastStore = useToastStore()
  const authStore = useAuthStore()

  // Prevent multiple simultaneous token refresh requests
  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (reason?: any) => void
  }> = []

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    failedQueue = []
  }

  // Create axios instance with enhanced config
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiUrl || 'http://localhost:3001/api',
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // ========================================
  // REQUEST INTERCEPTOR - Add Auth Token
  // ========================================
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStore.accessToken

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // ========================================
  // RESPONSE INTERCEPTOR - Error Handling & Token Refresh
  // ========================================
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error: AxiosError) => {
      const originalRequest: any = error.config

      // ========================================
      // NETWORK ERROR - No Internet Connection
      // ========================================
      if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          toastStore.error('⏱️ Tiempo de espera agotado. Verifica tu conexión.', 8000)
        } else {
          toastStore.error('🌐 Sin conexión a internet. Verifica tu red.', 8000)
        }
        return Promise.reject(error)
      }

      const status = error.response.status
      const errorData: any = error.response.data

      // ========================================
      // 401 UNAUTHORIZED - Token Expired/Invalid
      // ========================================
      if (status === 401 && !originalRequest._retry) {
        // Don't retry on auth endpoints to avoid infinite loops
        // Specific handling for logout to avoid recursion
        if (originalRequest.url?.includes('/auth/logout')) {
           return Promise.reject(error)
        }

        // Don't retry on other auth endpoints
        if (originalRequest.url?.includes('/auth/refresh') || 
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register')) {
          authStore.logout()
          router.push('/login')
          toastStore.error('Sesión expirada. Inicia sesión nuevamente.')
          return Promise.reject(error)
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return api(originalRequest)
            })
            .catch(err => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Attempt to refresh access token
          await authStore.refreshAccessToken()
          const newToken = authStore.accessToken

          // Process all queued requests with new token
          processQueue(null, newToken)
          
          // Retry original request with new token
          if (originalRequest.headers && newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }

          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed - logout user
          processQueue(refreshError, null)
          authStore.logout()
          router.push('/login')
          toastStore.error('⏰ Sesión expirada. Por favor inicia sesión nuevamente.')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // ========================================
      // 403 FORBIDDEN - Insufficient Permissions
      // ========================================
      if (status === 403) {
        toastStore.error('🚫 No tienes permisos para realizar esta acción.')
        router.push('/unauthorized')
        return Promise.reject(error)
      }

      // ========================================
      // 404 NOT FOUND
      // ========================================
      if (status === 404) {
        const errorMessage = errorData?.message || 'Recurso no encontrado'
        toastStore.error(`❌ ${errorMessage}`)
        return Promise.reject(error)
      }

      // ========================================
      // 409 CONFLICT - Duplicate Resource
      // ========================================
      if (status === 409) {
        const errorMessage = errorData?.message || 'Ya existe un recurso con esos datos'
        toastStore.warning(`⚠️ ${errorMessage}`, 6000)
        return Promise.reject(error)
      }

      // ========================================
      // 422 VALIDATION ERROR - Invalid Data
      // ========================================
      if (status === 422) {
        const errorMessage = errorData?.message || 'Error de validación en los datos'
        toastStore.error(`📝 ${errorMessage}`)
        
        // Show field-specific errors if available
        if (errorData?.errors && typeof errorData.errors === 'object') {
          const fieldErrors = Object.values(errorData.errors).flat().join(', ')
          if (fieldErrors) {
            toastStore.error(fieldErrors, 8000)
          }
        }
        return Promise.reject(error)
      }

      // ========================================
      // 429 TOO MANY REQUESTS - Rate Limiting
      // ========================================
      if (status === 429) {
        toastStore.warning('⏸️ Demasiadas solicitudes. Espera un momento.', 6000)
        return Promise.reject(error)
      }

      // ========================================
      // 500 INTERNAL SERVER ERROR
      // ========================================
      if (status === 500) {
        toastStore.error('🔥 Error del servidor. Intenta nuevamente más tarde.')
        return Promise.reject(error)
      }

      // ========================================
      // 502 BAD GATEWAY
      // ========================================
      if (status === 502) {
        toastStore.error('🌐 Servidor no disponible. Intenta más tarde.', 8000)
        return Promise.reject(error)
      }

      // ========================================
      // 503 SERVICE UNAVAILABLE
      // ========================================
      if (status === 503) {
        toastStore.error('⚠️ Servicio en mantenimiento. Intenta más tarde.', 8000)
        return Promise.reject(error)
      }

      // ========================================
      // GENERIC ERROR - Fallback
      // ========================================
      const errorMessage = errorData?.message || 'Ha ocurrido un error inesperado'
      toastStore.error(errorMessage)

      return Promise.reject(error)
    }
  )

  // ========================================
  // RETRY LOGIC - Intelligent Request Retry
  // ========================================
  const retryRequest = async (
    fn: () => Promise<any>,
    options: {
      maxRetries?: number
      delay?: number
      backoff?: boolean
      retryOn?: number[]
    } = {}
  ): Promise<any> => {
    const {
      maxRetries = 3,
      delay = 1000,
      backoff = true,
      retryOn = [408, 429, 500, 502, 503, 504] // Retry on these status codes
    } = options

    let lastError: any

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error: any) {
        lastError = error

        // Don't retry on client errors (4xx except specific ones)
        const status = error.response?.status
        if (status && status >= 400 && status < 500 && !retryOn.includes(status)) {
          throw error
        }

        // Last attempt failed
        if (attempt === maxRetries - 1) {
          throw error
        }

        // Calculate retry delay with exponential backoff
        const retryDelay = backoff ? delay * Math.pow(2, attempt) : delay
        
        toastStore.info(`🔄 Reintentando... (${attempt + 1}/${maxRetries})`, 2000)
        
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }

    throw lastError
  }

  // ========================================
  // ONLINE/OFFLINE DETECTION
  // ========================================
  if (process.client) {
    // Connection restored
    window.addEventListener('online', () => {
      toastStore.success('🌐 Conexión restaurada', 4000)
    })

    // Connection lost
    window.addEventListener('offline', () => {
      toastStore.warning('⚠️ Sin conexión a internet', 0) // Don't auto-dismiss
    })

    // Check connection status on app load
    if (!navigator.onLine) {
      toastStore.warning('⚠️ Sin conexión a internet', 0)
    }

    // Periodic connection check (every 30 seconds)
    setInterval(() => {
      if (!navigator.onLine && toastStore.toasts.length === 0) {
        toastStore.warning('⚠️ Sin conexión a internet', 0)
      }
    }, 30000)
  }

  // ========================================
  // PROVIDE API & HELPERS
  // ========================================
  return {
    provide: {
      api,
      apiRetry: retryRequest
    }
  }
})
