<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
            Equipos <span class="text-primary-500">Registrados</span>
          </h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Descubre los clubes que forman parte de nuestra comunidad.
          </p>
        </div>

        <div class="flex items-center gap-4 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">search</span>
            <input type="text" placeholder="Buscar equipo..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-sm">
          </div>
          <button class="btn-primary flex items-center gap-2 whitespace-nowrap">
            <span class="material-symbols-outlined">add</span>
            Registrar Equipo
          </button>
        </div>
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="team in teams" :key="team.id"
          class="group bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-border-dark hover:border-primary-500/50 transition-all duration-300 hover:shadow-neon cursor-pointer flex flex-col items-center text-center">
          <div
            class="w-24 h-24 rounded-full bg-surface-light dark:bg-surface-dark-alt mb-4 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
            <span class="text-4xl">{{ team.emoji }}</span>
            <div
              class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-surface-light dark:border-surface-dark"
              title="Verificado"></div>
          </div>

          <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-1">{{ team.name }}</h3>
          <p class="text-xs font-bold text-primary-600 dark:text-primary-500 uppercase tracking-wider mb-4">
            {{ team.sport }}
          </p>

          <div
            class="w-full grid grid-cols-3 gap-2 py-3 border-t border-b border-border-light dark:border-border-dark mb-4">
            <div>
              <span class="block text-xs text-text-secondary-light dark:text-text-secondary-dark">PJ</span>
              <span class="block font-bold text-text-primary-light dark:text-white">{{ team.stats.played }}</span>
            </div>
            <div>
              <span class="block text-xs text-text-secondary-light dark:text-text-secondary-dark">G</span>
              <span class="block font-bold text-text-primary-light dark:text-white">{{ team.stats.won }}</span>
            </div>
            <div>
              <span class="block text-xs text-text-secondary-light dark:text-text-secondary-dark">PTS</span>
              <span class="block font-bold text-primary-600 dark:text-primary-500">{{ team.stats.points }}</span>
            </div>
          </div>

          <button
            class="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-500 transition-colors">
            Ver Perfil ->
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const teams = [
  {
    id: 1,
    name: 'Olimpia',
    sport: 'Fútbol',
    emoji: '🦁',
    stats: { played: 14, won: 10, points: 32 }
  },
  {
    id: 2,
    name: 'Motagua',
    sport: 'Fútbol',
    emoji: '🦅',
    stats: { played: 14, won: 9, points: 29 }
  },
  {
    id: 3,
    name: 'Real España',
    sport: 'Fútbol',
    emoji: '🚂',
    stats: { played: 14, won: 7, points: 24 }
  },
  {
    id: 4,
    name: 'Marathón',
    sport: 'Fútbol',
    emoji: '🦖',
    stats: { played: 14, won: 7, points: 25 }
  },
  {
    id: 5,
    name: 'Trozos FC',
    sport: 'Fútbol 7',
    emoji: '🪵',
    stats: { played: 8, won: 2, points: 6 }
  },
  {
    id: 6,
    name: 'Lakers',
    sport: 'Baloncesto',
    emoji: '🏀',
    stats: { played: 12, won: 8, points: 24 }
  },
  {
    id: 7,
    name: 'Bulls',
    sport: 'Baloncesto',
    emoji: '🐂',
    stats: { played: 12, won: 6, points: 18 }
  },
  {
    id: 8,
    name: 'Lobos UPN',
    sport: 'Fútbol',
    emoji: '🐺',
    stats: { played: 14, won: 4, points: 15 }
  }
];

definePageMeta({
  layout: 'default'
});
</script>
