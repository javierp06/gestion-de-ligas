<template>
  <NuxtLink :to="`/teams/${team.id}`"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 block hover:scale-[1.02] cursor-pointer">
    <!-- Logo/Avatar -->
    <div class="flex items-start gap-4 mb-4">
      <div class="flex-shrink-0">
        <img v-if="team.logo" :src="team.logo" :alt="team.name" class="w-16 h-16 rounded-full object-cover bg-white" />
        <div v-else
          class="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-black text-2xl font-bold">
          {{ team.name.charAt(0) }}
        </div>
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
        <span>{{ $t('components.team_card.captain') }}: {{ team.captain_name }}</span>
      </div>
      <div v-if="team.player_count !== undefined" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">group</span>
        <span>{{ team.player_count }} {{ $t('components.team_card.players') }}</span>
      </div>
    </div>

    <!-- Stadium -->
    <div v-if="team.stadium"
      class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span class="material-symbols-outlined text-sm">stadium</span>
      <span>{{ team.stadium }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Team {
  id: number
  name: string
  short_name?: string
  logo?: string
  captain_name?: string
  founded_date?: string
  colors?: string
  stadium?: string
  player_count?: number
}

defineProps<{
  team: Team
}>()


</script>
