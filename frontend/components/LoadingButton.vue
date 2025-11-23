<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClass, sizeClass, fullWidth ? 'w-full' : '']"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
    
    <!-- Icon (if not loading) -->
    <span v-else-if="icon" class="material-symbols-outlined">{{ icon }}</span>
    
    <!-- Text -->
    <span>{{ loading ? loadingText : text }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text: string
  loadingText?: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'Cargando...',
  loading: false,
  disabled: false,
  type: 'button',
  variant: 'primary',
  size: 'md',
  fullWidth: false
})

const variantClass = computed(() => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-primary focus:ring-offset-2',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-400'
  }
  return variants[props.variant]
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }
  return sizes[props.size]
})
</script>
