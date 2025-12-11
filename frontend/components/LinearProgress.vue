<template>
  <!-- Linear-style Loading Progress Bar -->
  <Transition name="progress-fade">
    <div v-if="isLoading" class="linear-progress-bar">
      <div class="linear-progress-bar__fill"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const isLoading = ref(false)

// Listen to page loading events
nuxtApp.hook('page:start', () => {
  isLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  // Small delay for smooth transition
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<style scoped>
.linear-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: transparent;
  overflow: hidden;
}

.linear-progress-bar__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #1173d4 0%, #3b82f6 50%, #60a5fa 100%);
  animation: progressIndeterminate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow: 0 0 10px rgba(17, 115, 212, 0.5);
}

@keyframes progressIndeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.3);
  }

  50% {
    transform: translateX(0%) scaleX(0.5);
  }

  100% {
    transform: translateX(100%) scaleX(0.3);
  }
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
</style>
