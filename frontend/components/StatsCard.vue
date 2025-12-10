<template>
  <div
    class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md p-6 hover:shadow-neon transition-all duration-300 border border-border-light dark:border-border-dark h-full flex flex-col justify-between">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p
          class="text-xs md:text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1 uppercase tracking-wider line-clamp-2">
          {{ title }}
        </p>
        <p class="text-2xl md:text-3xl font-black" :class="getColorClass(color)">{{ value }}</p>
      </div>
      <div
        :class="`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${getBgClass(color)}`">
        <span class="material-symbols-outlined text-xl md:text-2xl" :class="getColorClass(color)">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}>()

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  }
  return colors[color] || colors.blue
}

const getBgClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20'
  }
  return colors[color] || colors.blue
}
</script>
