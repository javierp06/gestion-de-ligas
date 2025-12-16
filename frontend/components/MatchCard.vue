<template>
  <NuxtLink :to="localePath(`/matches/${match.id}`)"
    class="group flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary-500/30 transition-all duration-200">

    <!-- Time / Status -->
    <div class="flex flex-col items-start justify-center w-20 shrink-0">
      <template v-if="match.status === 'scheduled'">
        <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
          {{ formatTime(match.match_date) }}
        </span>
        <span class="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-0.5">
          {{ formatMatchDate(match.match_date, 'MMM DD') }}
        </span>
      </template>

      <template v-else-if="match.status === 'live'">
        <span class="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-wider mb-1">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live
        </span>
        <span class="text-sm font-mono font-medium text-gray-900 dark:text-white">
          {{ match.match_time || '00\'' }}
        </span>
      </template>

      <template v-else>
        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Final</span>
        <span class="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
          {{ formatMatchDate(match.match_date, 'DD/MM') }}
        </span>
      </template>
    </div>

    <!-- Teams Divider -->
    <div class="w-px h-8 bg-gray-100 dark:bg-white/10"></div>

    <!-- Teams Stack -->
    <div class="flex-1 min-w-0 flex flex-col justify-center gap-3">
      <!-- Home -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <img
            :src="match.home_team_logo || `https://ui-avatars.com/api/?name=${match.home_team_name}&background=transparent&color=3b82f6`"
            class="w-5 h-5 object-contain" alt="Home" />
          <span class="font-bold text-gray-900 dark:text-white text-sm truncate leading-none">
            {{ match.home_team_name }}
          </span>
        </div>
        <span v-if="match.status !== 'scheduled'" class="text-sm font-bold text-gray-900 dark:text-white">
          {{ match.home_score }}
        </span>
      </div>

      <!-- Away -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <img
            :src="match.away_team_logo || `https://ui-avatars.com/api/?name=${match.away_team_name}&background=transparent&color=ef4444`"
            class="w-5 h-5 object-contain" alt="Away" />
          <span class="font-bold text-gray-900 dark:text-white text-sm truncate leading-none">
            {{ match.away_team_name }}
          </span>
        </div>
        <span v-if="match.status !== 'scheduled'" class="text-sm font-bold text-gray-900 dark:text-white">
          {{ match.away_score }}
        </span>
      </div>
    </div>

    <!-- Chevron -->
    <div
      class="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all">
      <span class="material-symbols-outlined text-xl">chevron_right</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useSports } from '@/composables/useSports'
const { getStatusColor, getStatusText, formatMatchDate, formatTime } = useSports()
const localePath = useLocalePath()

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
  home_team_logo?: string
  away_team_logo?: string
  match_time?: string
}

defineProps<{
  match: Match
}>()
</script>
