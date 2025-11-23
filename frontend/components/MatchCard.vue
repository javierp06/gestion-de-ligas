<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-4"
    :class="{'bg-blue-50 dark:bg-blue-900/20': match.status === 'live'}"
  >
    <div class="flex items-center justify-between gap-4">
      <!-- Home Team -->
      <div class="flex-1 text-right">
        <p class="font-bold text-gray-900 dark:text-white truncate">
          {{ match.home_team_name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Local</p>
      </div>

      <!-- Score/Time -->
      <div class="flex flex-col items-center gap-1 min-w-[100px]">
        <span :class="getStatusColor(match.status)" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ getStatusText(match.status) }}
        </span>
        
        <div v-if="match.status === 'finished'" class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>{{ match.home_score }}</span>
          <span class="text-gray-400">-</span>
          <span>{{ match.away_score }}</span>
        </div>
        
        <div v-else class="text-sm text-gray-600 dark:text-gray-400">
          <p>{{ formatMatchDate(match.match_date) }}</p>
          <p>{{ formatTime(match.match_date) }}</p>
        </div>
      </div>

      <!-- Away Team -->
      <div class="flex-1">
        <p class="font-bold text-gray-900 dark:text-white truncate">
          {{ match.away_team_name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Visitante</p>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span v-if="match.location" class="flex items-center gap-1">
        <span class="material-symbols-outlined" style="font-size: 14px">location_on</span>
        {{ match.location }}
      </span>
      <span v-if="match.round" class="flex items-center gap-1">
        <span class="material-symbols-outlined" style="font-size: 14px">flag</span>
        Jornada {{ match.round }}
      </span>
    </div>
  </div>
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
