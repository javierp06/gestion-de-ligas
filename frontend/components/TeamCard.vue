<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
    <!-- Logo/Avatar -->
    <div class="flex items-start gap-4 mb-4">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
        {{ team.name.charAt(0) }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">
          {{ team.name }}
        </h3>
        <p v-if="team.short_name" class="text-sm text-gray-500 dark:text-gray-400">
          {{ team.short_name }}
        </p>
      </div>
    </div>

    <!-- Info -->
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <div v-if="team.captain_name" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">person</span>
        <span>Capitán: {{ team.captain_name }}</span>
      </div>
      <div v-if="team.founded_date" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">calendar_today</span>
        <span>Fundado: {{ formatDate(team.founded_date) }}</span>
      </div>
      <div v-if="team.colors" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">palette</span>
        <span>{{ team.colors }}</span>
      </div>
      <div v-if="team.player_count !== undefined" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">group</span>
        <span>{{ team.player_count }} jugadores</span>
      </div>
    </div>

    <!-- Stadium -->
    <div v-if="team.stadium" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span class="material-symbols-outlined text-sm">stadium</span>
      <span>{{ team.stadium }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Team {
  id: number
  name: string
  short_name?: string
  captain_name?: string
  founded_date?: string
  colors?: string
  stadium?: string
  player_count?: number
}

defineProps<{
  team: Team
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
