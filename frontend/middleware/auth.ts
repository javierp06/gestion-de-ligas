export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage if not already done
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }
  
  // Check if user is authenticated (only on client side for localStorage auth)
  if (process.client && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
