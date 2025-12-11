<template>
  <Teleport to="body">
    <!-- Main FAB -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <!-- Action Menu -->
      <Transition name="fab-menu">
        <div v-if="isOpen" class="flex flex-col gap-3">
          <button v-for="action in actions" :key="action.label" @click="handleAction(action)"
            class="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl rounded-full pl-4 pr-5 py-3 transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <!-- Label -->
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
              {{ action.label }}
            </span>

            <!-- Icon -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              :class="action.color || 'bg-primary text-white'">
              <span class="material-symbols-outlined text-xl">{{ action.icon }}</span>
            </div>
          </button>
        </div>
      </Transition>

      <!-- Main Button -->
      <button @click="toggle"
        class="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        :class="{ 'rotate-45': isOpen }">
        <span class="material-symbols-outlined text-3xl transition-transform duration-300">
          {{ isOpen ? 'close' : 'add' }}
        </span>
      </button>
    </div>

    <!-- Backdrop -->
    <Transition name="backdrop">
      <div v-if="isOpen" @click="close" class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"></div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
export interface FABAction {
  icon: string
  label: string
  onClick: () => void
  color?: string
}

interface Props {
  actions: FABAction[]
}

defineProps<Props>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleAction = (action: FABAction) => {
  action.onClick()
  close()
}

// Close on escape
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen.value) {
        close()
      }
    })
  }
})
</script>

<style scoped>
/* FAB Menu Animation */
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Backdrop Animation */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: all 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Shadow helper */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
