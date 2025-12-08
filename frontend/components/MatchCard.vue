<template>
  <NuxtLink :to="`/matches/${match.id}`"
    class="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-4"
    :class="{ 'bg-blue-50 dark:bg-blue-900/20': match.status === 'live' }">
    <div class="flex items-center justify-between gap-4">
      <!-- Home Team -->
      <div class="flex-1 text-right min-w-0">
        <p class="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2 leading-tight">
          {{ match.home_team_name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('components.match_card.home') }}</p>
      </div>

      <!-- Score/Time -->
      <div class="flex flex-col items-center gap-1 min-w-[100px] shrink-0">
        <span :class="getStatusColor(match.status)"
          class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
          {{ getStatusText(match.status) }}
        </span>

        <div v-if="match.status === 'finished'"
          class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>{{ match.home_score }}</span>
          <span class="text-gray-400">-</span>
          <span>{{ match.away_score }}</span>
        </div>

        <div v-else class="text-sm text-gray-600 dark:text-gray-400 text-center">
          <p class="font-medium">{{ formatMatchDate(match.match_date) }}</p>
          <p class="text-xs">{{ formatTime(match.match_date) }}</p>
        </div>
      </div>

      <!-- Away Team -->
      <div class="flex-1 text-left min-w-0">
        <p class="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2 leading-tight">
          {{ match.away_team_name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('components.match_card.away') }}</p>
      </div>
    </div>

    <!-- Additional Info -->
    <div
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span v-if="match.location" class="flex items-center gap-1">
        <span class="material-symbols-outlined" style="font-size: 14px">location_on</span>
        {{ match.location }}
      </span>
      <span v-if="match.round" class="flex items-center gap-1">
        <span class="material-symbols-outlined" style="font-size: 14px">flag</span>
        {{ $t('components.match_card.round') }} {{ match.round }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { getStatusColor, getStatusText, formatMatchDate, formatTime } = useSports()

interface Match {
  id: number
  home_team_name: string
  away_team_name: string
  home_score?: number
  away_score?: number
  match_date: string
  status: string
  location?: string
  round?: number
}

defineProps<{
  match: Match
}>()
</script>
