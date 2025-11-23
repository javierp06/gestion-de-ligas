<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
            Calendario de <span class="text-primary-500">Partidos</span>
          </h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            No te pierdas ningún encuentro. Sigue los resultados en vivo.
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-border-light dark:border-border-dark">
          <button @click="viewMode = 'list'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
            :class="viewMode === 'list' ? 'bg-primary-500 text-black shadow-neon' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
            Lista
          </button>
          <button @click="viewMode = 'calendar'"
            class="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
            :class="viewMode === 'calendar' ? 'bg-primary-500 text-black shadow-neon' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
            Calendario
          </button>
        </div>
      </div>


      <div
        class="flex items-center justify-between bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-4 mb-8">
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <div class="flex items-center gap-8 overflow-x-auto scrollbar-hide px-4">
          <div v-for="date in dates" :key="date.value" @click="selectedDate = date.value"
            class="flex flex-col items-center gap-1 cursor-pointer group transition-all duration-300"
            :class="selectedDate === date.value ? 'scale-110' : 'opacity-50 hover:opacity-100'">
            <span class="text-xs font-bold transition-colors"
              :class="selectedDate === date.value ? 'text-primary-500' : 'text-text-secondary-light dark:text-text-secondary-dark'">
              {{ date.label }}
            </span>
            <span
              class="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300"
              :class="selectedDate === date.value ? 'bg-primary-500 text-black shadow-neon' : 'bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white'">
              {{ date.day }}
            </span>
          </div>
        </div>

        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>


      <div class="space-y-6">

        <div v-for="league in filteredLeagues" :key="league.name"
          class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
          <div
            class="px-6 py-4 bg-surface-light dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ league.emoji }}</span>
              <h3 class="font-bold text-text-primary-light dark:text-white">{{ league.name }}</h3>
            </div>
            <NuxtLink :to="`/leagues/${league.id}`"
              class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 transition-colors uppercase tracking-wide">
              Ver Tabla ->
            </NuxtLink>
          </div>

          <div class="divide-y divide-border-light dark:divide-border-dark">
            <div v-for="match in league.matches" :key="match.id"
              class="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
              <div class="flex flex-col md:flex-row items-center gap-6">

                <div class="flex flex-col items-center min-w-[80px]">
                  <span v-if="match.status === 'live'"
                    class="text-red-500 font-bold animate-pulse">{{ match.time }}'</span>
                  <span v-else
                    class="text-text-secondary-light dark:text-text-secondary-dark font-bold">{{ match.time }}</span>
                  <span
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase mt-1">{{ match.date }}</span>
                </div>


                <div class="flex-1 w-full grid grid-cols-3 items-center gap-4">
                  <div class="flex items-center justify-end gap-4 text-right">
                    <span
                      class="font-bold text-text-primary-light dark:text-white md:text-lg">{{ match.home_team }}</span>
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                  </div>

                  <div class="flex items-center justify-center gap-3">
                    <span
                      class="text-2xl md:text-3xl font-black text-text-primary-light dark:text-white">{{ match.home_score }}</span>
                    <span class="text-text-secondary-light dark:text-text-secondary-dark font-bold">-</span>
                    <span
                      class="text-2xl md:text-3xl font-black text-text-primary-light dark:text-white">{{ match.away_score }}</span>
                  </div>

                  <div class="flex items-center justify-start gap-4 text-left">
                    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                    <span
                      class="font-bold text-text-primary-light dark:text-white md:text-lg">{{ match.away_team }}</span>
                  </div>
                </div>


                <div class="hidden md:block">
                  <button
                    class="p-2 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 hover:border-primary-500 transition-colors">
                    <span class="material-symbols-outlined">analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div v-if="filteredLeagues.length === 0"
          class="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark border-dashed">
          <span
            class="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark mb-2">event_busy</span>
          <p class="text-text-secondary-light dark:text-text-secondary-dark font-bold">No hay partidos para esta fecha
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const viewMode = ref('list'); // 'list' | 'calendar'
const selectedDate = ref('HOY');

const dates = [
  { label: 'HOY', value: 'HOY', day: '23', active: true },
  { label: 'MAÑ', value: 'MAÑ', day: '24', active: false },
  { label: 'DOM', value: 'DOM', day: '25', active: false },
  { label: 'LUN', value: 'LUN', day: '26', active: false },
  { label: 'MAR', value: 'MAR', day: '27', active: false }
];

const matchesByLeague = [
  {
    id: 1,
    name: 'Torneo Apertura 2024',
    emoji: '⚽',
    matches: [
      {
        id: 101,
        date: 'HOY',
        time: '78',
        status: 'live',
        home_team: 'Olimpia',
        home_score: 2,
        away_team: 'Motagua',
        away_score: 1
      },
      {
        id: 102,
        date: 'HOY',
        time: '19:00',
        status: 'scheduled',
        home_team: 'Real España',
        home_score: '-',
        away_team: 'Marathón',
        away_score: '-'
      },
      {
        id: 103,
        date: 'MAÑ',
        time: '15:00',
        status: 'scheduled',
        home_team: 'Vida',
        home_score: '-',
        away_team: 'Victoria',
        away_score: '-'
      }
    ]
  },
  {
    id: 2,
    name: 'Liga Bancaria',
    emoji: '🏀',
    matches: [
      {
        id: 201,
        date: 'HOY',
        time: 'FT',
        status: 'finished',
        home_team: 'BAC Credomatic',
        home_score: 86,
        away_team: 'Ficohsa',
        away_score: 82
      },
      {
        id: 202,
        date: 'DOM',
        time: '10:00',
        status: 'scheduled',
        home_team: 'Davivienda',
        home_score: '-',
        away_team: 'Banpais',
        away_score: '-'
      }
    ]
  }
];

// Filter matches based on selected date
const filteredLeagues = computed(() => {
  return matchesByLeague.map(league => ({
    ...league,
    matches: league.matches.filter(m => m.date === selectedDate.value)
  })).filter(league => league.matches.length > 0);
});

definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
