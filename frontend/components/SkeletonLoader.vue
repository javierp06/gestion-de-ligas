<template>
  <div
    class="animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] skeleton-shimmer"
    :class="[shapeClass, className]" :style="customStyle"></div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'text' | 'title' | 'avatar' | 'thumbnail' | 'card' | 'button'
  width?: string
  height?: string
  circle?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const shapeClass = computed(() => {
  if (props.circle) return 'rounded-full'

  const shapes = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'w-10 h-10 rounded-full',
    thumbnail: 'w-full aspect-video rounded-lg',
    card: 'w-full h-48 rounded-xl',
    button: 'h-10 w-32 rounded-lg'
  }
  return shapes[props.type]
})

const customStyle = computed(() => {
  const style: any = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  return style
})
</script>

<style scoped>
.skeleton-shimmer {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
