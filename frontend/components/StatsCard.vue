<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ title }}</p>
        <p class="text-3xl font-bold" :class="getColorClass(color)">{{ value }}</p>
      </div>
      <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getBgClass(color)}`">
        <span class="material-symbols-outlined text-2xl" :class="getColorClass(color)">{{ icon }}</span>
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
