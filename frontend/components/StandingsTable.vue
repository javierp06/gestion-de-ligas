<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="border-b border-border-light dark:border-border-dark">
          <th
            class="px-4 py-4 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
            #
          </th>
          <th
            class="px-4 py-4 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
            Equipo
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider"
            title="Partidos Jugados">
            PJ
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider hidden sm:table-cell"
            title="Ganados">
            G
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider hidden sm:table-cell"
            title="Empatados">
            E
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider hidden sm:table-cell"
            title="Perdidos">
            P
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider hidden md:table-cell"
            title="Goles a Favor">
            GF
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider hidden md:table-cell"
            title="Goles en Contra">
            GC
          </th>
          <th
            class="px-2 py-4 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider"
            title="Diferencia de Goles">
            DG
          </th>
          <th class="px-4 py-4 text-center text-xs font-black text-primary-500 uppercase tracking-wider">
            PTS
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-light dark:divide-border-dark">
        <tr v-for="(standing, index) in standings" :key="standing.id"
          class="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">

          <!-- Position -->
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
              :class="getPositionClass(index + 1)">
              {{ index + 1 }}
            </div>
          </td>

          <!-- Team -->
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-surface-light dark:bg-surface-dark-alt p-1 shadow-sm flex items-center justify-center border border-border-light dark:border-border-dark group-hover:border-primary-500/50 transition-colors">
                <img v-if="standing.team_logo" :src="standing.team_logo" :alt="standing.team_name"
                  class="w-full h-full object-contain" />
                <span v-else class="text-lg font-bold text-primary-500">{{ standing.team_name?.charAt(0) }}</span>
              </div>
              <span
                class="font-bold text-text-primary-light dark:text-white group-hover:text-primary-500 transition-colors">
                {{ standing.team_name }}
              </span>
            </div>
          </td>

          <!-- Stats -->
          <td class="px-2 py-4 text-center text-sm font-medium text-text-primary-light dark:text-white">
            {{ standing.matches_played }}
          </td>
          <td class="px-2 py-4 text-center text-sm text-green-600 dark:text-green-400 font-medium hidden sm:table-cell">
            {{ standing.wins }}
          </td>
          <td
            class="px-2 py-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark hidden sm:table-cell">
            {{ standing.draws }}
          </td>
          <td class="px-2 py-4 text-center text-sm text-red-500 dark:text-red-400 hidden sm:table-cell">
            {{ standing.losses }}
          </td>
          <td
            class="px-2 py-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark hidden md:table-cell">
            {{ standing.goals_for }}
          </td>
          <td
            class="px-2 py-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark hidden md:table-cell">
            {{ standing.goals_against }}
          </td>
          <td class="px-2 py-4 text-center text-sm font-bold"
            :class="standing.goal_difference > 0 ? 'text-green-600 dark:text-green-400' : (standing.goal_difference < 0 ? 'text-red-500 dark:text-red-400' : 'text-text-secondary-light dark:text-text-secondary-dark')">
            {{ standing.goal_difference > 0 ? '+' : '' }}{{ standing.goal_difference }}
          </td>
          <td
            class="px-4 py-4 text-center text-base font-black text-text-primary-light dark:text-white group-hover:scale-110 transition-transform">
            {{ standing.points }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Legend/Footer -->
    <div
      class="px-4 py-4 border-t border-border-light dark:border-border-dark flex flex-wrap gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-primary-500"></div>
        <span>Líder / Clasificación</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-400"></div>
        <span>Zona de Clasificación</span>
      </div>
      <span class="ml-auto opacity-50 hidden sm:inline">Actualizado automáticamente</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Standing {
  id: number
  team_name: string
  team_logo?: string
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

const getPositionClass = (pos: number) => {
  if (pos === 1) return 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
  if (pos <= 4) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  return 'bg-gray-100 dark:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark'
}
</script>
