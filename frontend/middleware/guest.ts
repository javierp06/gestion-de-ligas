export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage if not already done
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }
  
  // If already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
