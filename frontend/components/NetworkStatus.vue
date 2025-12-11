<template>
  <Transition name="fade">
    <div v-if="!isOnline" class="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-3 px-4 shadow-lg"
      role="alert">
      <div class="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span class="material-symbols-outlined animate-pulse">wifi_off</span>
        <span class="font-semibold">Sin conexión a internet</span>
        <span class="text-sm opacity-90">Reconectando...</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOnline } = useNetworkStatus()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
