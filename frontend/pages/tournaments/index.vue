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
        <div v-for="tournament in filteredTournaments" :key="tournament.id"
          @click="navigateTo(`/tournaments/${tournament.id}`)"
          class="group bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark hover:border-primary-500/50 transition-all duration-300 hover:shadow-neon cursor-pointer">

          <div class="h-40 bg-surface-light dark:bg-surface-dark-alt relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

            <div class="absolute bottom-4 left-4 z-20">
              <span
                class="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1 block">{{ tournament.sport_name }}</span>
              <h3 class="text-xl font-bold text-white leading-tight">{{ tournament.name }}</h3>
            </div>

            <div class="absolute top-4 right-4 z-20">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border"
                :class="tournament.status === 'upcoming' || tournament.status === 'open' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'">
                {{ tournament.status === 'upcoming' ? 'Inscripciones' : (tournament.status === 'in_progress' ? 'En Curso' : tournament.status) }}
              </span>
            </div>
          </div>


          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Equipos</span>
                <span
                  class="text-lg font-bold text-text-primary-light dark:text-white">{{ tournament.teams_count || 0 }}/{{
                    tournament.max_teams || '∞' }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Inicio</span>
                <span
                  class="text-lg font-bold text-text-primary-light dark:text-white">{{ formatDate(tournament.start_date) }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Liga</span>
                <span
                  class="text-lg font-bold text-primary-600 dark:text-primary-500 truncate block">{{ tournament.league_name }}</span>
              </div>
              <div>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark block mb-1">Formato</span>
                <span
                  class="text-lg font-bold text-text-primary-light dark:text-white capitalize">{{ tournament.format }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-border-light dark:border-border-dark">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i"
                  class="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                  <span class="material-symbols-outlined text-xs">group</span>
                </div>
              </div>
              <span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {{ tournament.teams_count || 0 }} equipos inscritos
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNuxtApp, useAsyncData, navigateTo, definePageMeta } from '#app'

const { $api } = useNuxtApp()

const filter = ref('all') // all, open, active, finished

const { data: tournaments, refresh } = await useAsyncData('tournaments-list', async () => {
  const response = await $api.get('/tournaments')
  return response.data.success ? response.data.data : []
})

const filteredTournaments = computed(() => {
  if (!tournaments.value) return []

  if (filter.value === 'all') return tournaments.value

  if (filter.value === 'open') {
    return tournaments.value.filter((t: any) => t.status === 'upcoming' || t.status === 'open')
  }

  if (filter.value === 'active') {
    return tournaments.value.filter((t: any) => t.status === 'active' || t.status === 'in_progress')
  }

  if (filter.value === 'finished') {
    return tournaments.value.filter((t: any) => t.status === 'completed' || t.status === 'finished')
  }

  return tournaments.value
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'Por definir'
  return new Date(dateString).toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'short'
  })
}

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
