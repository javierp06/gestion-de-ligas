<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4">
      <TransitionGroup name="toast">
        <div v-for="toast in toastStore.toasts" :key="toast.id"
          class="pointer-events-auto transform transition-all duration-300 ease-out">
          <div class="flex items-start gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-sm"
            :class="getToastClasses(toast.type)" role="alert">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-xl" :class="getIconClasses(toast.type)">
                {{ getIcon(toast.type) }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="getTextClasses(toast.type)">
                {{ toast.message }}
              </p>

              <!-- Action Button -->
              <button v-if="toast.action" @click="toast.action.onClick"
                class="mt-2 text-xs font-semibold underline hover:no-underline" :class="getActionClasses(toast.type)">
                {{ toast.action.label }}
              </button>
            </div>

            <!-- Close Button -->
            <button @click="toastStore.remove(toast.id)"
              class="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-md transition-colors"
              :class="getCloseButtonClasses(toast.type)">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/toast'
import type { ToastType } from '~/stores/toast'

const toastStore = useToastStore()

const getIcon = (type: ToastType): string => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[type]
}

const getToastClasses = (type: ToastType): string => {
  const classes = {
    success: 'bg-green-50/95 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50/95 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50/95 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50/95 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  }
  return classes[type]
}

const getIconClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  return classes[type]
}

const getTextClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-900 dark:text-green-100',
    error: 'text-red-900 dark:text-red-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    info: 'text-blue-900 dark:text-blue-100'
  }
  return classes[type]
}

const getActionClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-700 dark:text-green-300',
    error: 'text-red-700 dark:text-red-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    info: 'text-blue-700 dark:text-blue-300'
  }
  return classes[type]
}

const getCloseButtonClasses = (type: ToastType): string => {
  const classes = {
    success: 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50',
    error: 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50',
    warning: 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/50',
    info: 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50'
  }
  return classes[type]
}
</script>

<style scoped>
/* Toast animations */
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.2s ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
}
</style>
