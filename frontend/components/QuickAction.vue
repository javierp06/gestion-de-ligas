<template>
  <div 
    @click="$emit('click')"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
  >
    <div class="flex items-start gap-4">
      <div :class="`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgClass()}`">
        <span class="material-symbols-outlined text-2xl text-primary">{{ icon }}</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ description }}</p>
      </div>
      <span class="material-symbols-outlined text-gray-400">arrow_forward</span>
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
