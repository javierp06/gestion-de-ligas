export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage if not already done
  if (process.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Check if user is organizer or admin
  if (!authStore.isOrganizer && !authStore.isAdmin) {
    return navigateTo('/unauthorized')
  }
})
