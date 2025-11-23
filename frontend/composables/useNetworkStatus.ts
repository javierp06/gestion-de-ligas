// Network Status Composable - Monitor connection and show feedback
export const useNetworkStatus = () => {
  const isOnline = ref(true)
  const toastStore = useToastStore()

  const checkConnection = () => {
    if (process.client) {
      isOnline.value = navigator.onLine
    }
  }

  const handleOnline = () => {
    isOnline.value = true
    toastStore.success('🌐 Conexión restaurada', 3000)
  }

  const handleOffline = () => {
    isOnline.value = false
    toastStore.warning('⚠️ Sin conexión a internet', 0)
  }

  onMounted(() => {
    if (process.client) {
      checkConnection()
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  })

  return {
    isOnline: readonly(isOnline),
    checkConnection
  }
}
