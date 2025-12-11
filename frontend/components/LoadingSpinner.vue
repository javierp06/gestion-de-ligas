<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="animate-spin rounded-full border-solid border-t-transparent" :class="[sizeClass, colorClass]"
      :style="{ borderWidth: borderWidth }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray' | 'success' | 'error'
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  fullscreen: false
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-600 dark:border-gray-400',
    success: 'border-green-600',
    error: 'border-red-600'
  }
  return colors[props.color]
})

const borderWidth = computed(() => {
  const widths = {
    xs: '2px',
    sm: '2px',
    md: '3px',
    lg: '4px',
    xl: '4px'
  }
  return widths[props.size]
})

const containerClass = computed(() => {
  return props.fullscreen
    ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : ''
})
</script>
