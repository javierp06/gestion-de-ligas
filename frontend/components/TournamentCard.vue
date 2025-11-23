<template>
  <div @click="$emit('click')"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white flex-1 line-clamp-2">
        {{ tournament.name }}
      </h3>
      <span :class="getStatusColor(tournament.status)"
        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
        {{ getStatusText(tournament.status) }}
      </span>
    </div>

    <!-- League -->
    <p v-if="tournament.league_name" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
      🏆 {{ tournament.league_name }}
    </p>

    <!-- Format Badge -->
    <div class="mb-4">
      <span
        class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
        <span class="material-symbols-outlined text-sm">
          {{ tournament.format === 'knockout' ? 'trophy' : tournament.format === 'group_knockout' ? 'grid_view' : 'list' }}
        </span>
        {{ formatText(tournament.format) }}
      </span>
    </div>

    <!-- Dates -->
    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <div v-if="tournament.start_date" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">event</span>
        <span>{{ $t('components.tournament_card.start') }}: {{ formatDate(tournament.start_date) }}</span>
      </div>
      <div v-if="tournament.end_date" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">event</span>
        <span>{{ $t('components.tournament_card.end') }}: {{ formatDate(tournament.end_date) }}</span>
      </div>
      <div v-if="tournament.max_teams" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">group</span>
        <span>{{ $t('components.tournament_card.max_teams', { count: tournament.max_teams }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getStatusColor, getStatusText } = useSports()

interface Tournament {
  id: number
  name: string
  league_name?: string
  status: string
  format: string
  start_date?: string
  end_date?: string
  max_teams?: number
}

defineProps<{
  tournament: Tournament
}>()

defineEmits<{
  click: []
}>()

const { t } = useI18n()

const formatText = (format: string) => {
  const key = `components.tournament_card.formats.${format}`
  return t(key)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
