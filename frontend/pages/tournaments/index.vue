<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
            Torneos <span class="text-primary-500">Oficiales</span>
          </h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Compite por la gloria en nuestros torneos destacados.
          </p>
        </div>

        <button class="btn-primary self-start md:self-auto flex items-center gap-2">
          <span class="material-symbols-outlined">add</span>
          Crear Torneo
        </button>
      </div>


      <div class="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button class="px-4 py-2 rounded-lg bg-primary-500 text-black font-bold text-sm shadow-neon">
          Todos
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-bold text-sm hover:text-text-primary-light dark:hover:text-white transition-colors">
          Inscripciones Abiertas
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-bold text-sm hover:text-text-primary-light dark:hover:text-white transition-colors">
          En Curso
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-bold text-sm hover:text-text-primary-light dark:hover:text-white transition-colors">
          Finalizados
        </button>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tournament in tournaments" :key="tournament.id"
          class="group bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark hover:border-primary-500/50 transition-all duration-300 hover:shadow-neon cursor-pointer">

          <div class="h-40 bg-surface-light dark:bg-surface-dark-alt relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

            <div class="absolute inset-0 opacity-20"
              :style="`background-image: radial-gradient(${tournament.color} 2px, transparent 2px); background-size: 20px 20px;`">
            </div>

            <div class="absolute bottom-4 left-4 z-20">
              <span
                class="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1 block">{{ tournament.sport }}</span>
              <h3 class="text-xl font-bold text-white leading-tight">{{ tournament.name }}</h3>
            </div>

            <div class="absolute top-4 right-4 z-20">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border"
                :class="tournament.status === 'open' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'">
                {{ tournament.status === 'open' ? 'Inscripciones' : 'En Curso' }}
              </span>
            </div>
          </div>


          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Equipos</span>
                <span
                  class="text-lg font-bold text-text-primary-light dark:text-white">{{ tournament.teams_registered }}/{{
                    tournament.teams_max }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Inicio</span>
                <span
                  class="text-lg font-bold text-text-primary-light dark:text-white">{{ tournament.start_date }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Premio</span>
                <span class="text-lg font-bold text-primary-600 dark:text-primary-500">{{ tournament.prize }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Formato</span>
                <span class="text-lg font-bold text-text-primary-light dark:text-white">{{ tournament.format }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-border-light dark:border-border-dark">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i"
                  class="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                  {{ String.fromCharCode(64 + i) }}
                </div>
                <div
                  class="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark bg-gray-100 dark:bg-white/10">
                  +5
                </div>
              </div>
              <span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">Ya
                inscritos</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const tournaments = [
  {
    id: 1,
    name: 'Copa Navidad 2024',
    sport: 'Fútbol 7',
    status: 'open',
    teams_registered: 12,
    teams_max: 16,
    start_date: '15 Dic',
    prize: 'L 25,000',
    format: 'Grupos + KO',
    color: '#ef4444'
  },
  {
    id: 2,
    name: 'Liga Empresarial',
    sport: 'Baloncesto',
    status: 'active',
    teams_registered: 10,
    teams_max: 10,
    start_date: 'En Curso',
    prize: 'Trofeo',
    format: 'Liga',
    color: '#f59e0b'
  },
  {
    id: 3,
    name: 'Torneo Relámpago',
    sport: 'Voleibol',
    status: 'open',
    teams_registered: 4,
    teams_max: 8,
    start_date: '20 Nov',
    prize: 'L 5,000',
    format: 'Eliminatoria',
    color: '#3b82f6'
  },
  {
    id: 4,
    name: 'Champions Weekend',
    sport: 'Fútbol',
    status: 'open',
    teams_registered: 8,
    teams_max: 32,
    start_date: '01 Dic',
    prize: 'L 50,000',
    format: 'KO Directo',
    color: '#10b981'
  }
];

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
