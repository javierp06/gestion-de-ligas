// Global plugin to initialize toast store and handle errors
export default defineNuxtPlugin((nuxtApp) => {
  // Initialize toast store
  const toastStore = useToastStore()

  // Global error handler
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error)
    toastStore.error('Ha ocurrido un error inesperado')
  }

  // Return toast functions for easy access
  return {
    provide: {
      toast: {
        success: (msg: string, duration?: number) => toastStore.success(msg, duration),
        error: (msg: string, duration?: number) => toastStore.error(msg, duration),
        warning: (msg: string, duration?: number) => toastStore.warning(msg, duration),
        info: (msg: string, duration?: number) => toastStore.info(msg, duration)
      }
    }
  }
})
