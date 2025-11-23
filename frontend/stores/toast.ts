import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[]
  }),

  actions: {
    show(type: ToastType, message: string, duration = 5000, action?: Toast['action']) {
      const id = `toast-${Date.now()}-${Math.random()}`
      
      const toast: Toast = {
        id,
        type,
        message,
        duration,
        action
      }

      this.toasts.push(toast)

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }

      return id
    },

    success(message: string, duration?: number, action?: Toast['action']) {
      return this.show('success', message, duration, action)
    },

    error(message: string, duration?: number, action?: Toast['action']) {
      return this.show('error', message, duration, action)
    },

    warning(message: string, duration?: number, action?: Toast['action']) {
      return this.show('warning', message, duration, action)
    },

    info(message: string, duration?: number, action?: Toast['action']) {
      return this.show('info', message, duration, action)
    },

    remove(id: string) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clear() {
      this.toasts = []
    }
  }
})
