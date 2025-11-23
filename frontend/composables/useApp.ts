// Utility composable to help with proper TypeScript imports
export const useApp = () => {
  const toastStore = useToastStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const { $api } = useNuxtApp()

  return {
    toastStore,
    authStore,
    router,
    route,
    $api
  }
}
