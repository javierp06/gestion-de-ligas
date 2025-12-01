<template>
  <div @click="$emit('click')"
    class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-neon hover:scale-105 transition-all duration-300 border border-border-light dark:border-border-dark group">
    <div class="flex items-start gap-4">
      <div
        :class="`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgClass()} group-hover:bg-primary-500 group-hover:text-black transition-colors`">
        <span
          class="material-symbols-outlined text-2xl text-primary-500 group-hover:text-black transition-colors">{{ icon }}</span>
      </div>
      <div class="flex-1">
        <h3
          class="text-lg font-bold text-text-primary-light dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
          {{ title }}</h3>
        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">{{ description }}</p>
      </div>
      <span
        class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()

defineEmits<{
  click: []
}>()

const getBgClass = () => {
  return 'bg-primary/10 dark:bg-primary/20'
}
</script>
