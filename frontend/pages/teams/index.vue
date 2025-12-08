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
            <input type="text" v-model="searchQuery" placeholder="Buscar equipo..."
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-sm text-text-primary-light dark:text-white placeholder-text-secondary-light dark:placeholder-text-secondary-dark">
          </div>
          <button
            class="btn-primary flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg shadow-neon hover:scale-105 transition-transform">
            <span class="material-symbols-outlined">add</span>
            <span class="font-bold">Registrar Equipo</span>
          </button>
        </div>
      </div>


      <div v-if="teams.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink v-for="team in teams" :key="team.id" :to="`/teams/${team.id}`"
          class="group bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-border-dark hover:border-primary-500/50 transition-all duration-300 hover:shadow-neon cursor-pointer flex flex-col items-center text-center relative overflow-hidden">

          <!-- Background Decoration -->
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>

          <div
            class="w-24 h-24 rounded-full bg-surface-light dark:bg-surface-dark-alt mb-4 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 overflow-hidden shadow-lg border-2 border-transparent group-hover:border-primary-500">
            <img v-if="team.logo" :src="team.logo" :alt="team.name" class="w-full h-full object-cover" />
            <span v-else
              class="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">groups</span>
          </div>

          <h3 class="text-lg font-black text-text-primary-light dark:text-white mb-1 tracking-tight">{{ team.name }}
          </h3>
          <p class="text-xs font-bold text-primary-600 dark:text-primary-500 uppercase tracking-wider mb-6">
            {{ team.sport }}
          </p>

          <div
            class="w-full grid grid-cols-3 gap-2 py-3 border-t border-b border-border-light dark:border-border-dark mb-6 bg-gray-50/50 dark:bg-white/5 rounded-lg">
            <div>
              <span
                class="block text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">Juegos</span>
              <span
                class="block font-black text-lg text-text-primary-light dark:text-white leading-none">{{ team.stats.played }}</span>
            </div>
            <div>
              <span
                class="block text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">Ganes</span>
              <span
                class="block font-black text-lg text-text-primary-light dark:text-white leading-none">{{ team.stats.won }}</span>
            </div>
            <div>
              <span
                class="block text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">Puntos</span>
              <span
                class="block font-black text-lg text-primary-600 dark:text-primary-500 leading-none">{{ team.stats.points }}</span>
            </div>
          </div>

          <button
            class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-500 transition-colors uppercase tracking-widest flex items-center gap-1">
            Ver Perfil <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </NuxtLink>
      </div>

      <!-- No Results State -->
      <div v-else class="text-center py-20">
        <span
          class="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4 opacity-50">search_off</span>
        <h3 class="text-xl font-bold text-text-primary-light dark:text-white mb-2">No se encontraron equipos</h3>
        <p class="text-text-secondary-light dark:text-text-secondary-dark">Intenta buscar con otro nombre o categoría.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTeamStore } from '@/stores/team';

const teamStore = useTeamStore();
const searchQuery = ref('');

onMounted(() => {
  teamStore.fetchTeams();
});

const teams = computed(() => {
  let filtered = teamStore.teams;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.sport_name?.toLowerCase().includes(query)
    );
  }

  return filtered.map(team => ({
    ...team,
    sport: team.sport_name,
    stats: {
      played: team.total_played || 0,
      won: team.total_won || 0,
      points: team.total_points || 0
    }
  }));
});

definePageMeta({
  layout: 'default'
});
</script>
