<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <thead class="bg-gray-100 dark:bg-gray-700 sticky top-0">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.pos') }}</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.team') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.pj') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.g') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.e') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.p') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.gf') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.gc') }}</th>
          <th class="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.dg') }}</th>
          <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {{ $t('table.pts') }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(standing, index) in standings" :key="standing.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-green-50 dark:bg-green-900/20': index < 4 }">
          <td class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
            {{ standing.position || index + 1 }}
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ standing.team_name?.charAt(0) || '?' }}
              </div>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ standing.team_name }}
              </span>
            </div>
          </td>
          <td class="px-2 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
            {{ standing.matches_played }}
          </td>
          <td class="px-2 py-3 text-center text-sm text-green-600 dark:text-green-400 font-medium">
            {{ standing.wins }}
          </td>
          <td class="px-2 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
            {{ standing.draws }}
          </td>
          <td class="px-2 py-3 text-center text-sm text-red-600 dark:text-red-400">
            {{ standing.losses }}
          </td>
          <td class="px-2 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
            {{ standing.goals_for }}
          </td>
          <td class="px-2 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
            {{ standing.goals_against }}
          </td>
          <td class="px-2 py-3 text-center text-sm font-medium"
            :class="standing.goal_difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ standing.goal_difference > 0 ? '+' : '' }}{{ standing.goal_difference }}
          </td>
          <td class="px-4 py-3 text-center text-sm font-bold text-primary">
            {{ standing.points }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Legend -->
    <div class="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
        <span>{{ $t('table.legend.qualification') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold">{{ $t('table.pj') }}:</span> {{ $t('table.legend.pj') }}
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold">{{ $t('table.g') }}/{{ $t('table.e') }}/{{ $t('table.p') }}:</span>
        {{ $t('table.legend.gep') }}
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold">{{ $t('table.dg') }}:</span> {{ $t('table.legend.dg') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Standing {
  id: number
  team_name: string
  position?: number
  matches_played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

defineProps<{
  standings: Standing[]
}>()
</script>
