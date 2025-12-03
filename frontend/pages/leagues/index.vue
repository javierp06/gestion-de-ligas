<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
            Ligas <span class="text-primary-500">Activas</span>
          </h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Explora y únete a las mejores competiciones.
          </p>
        </div>

        <NuxtLink v-if="authStore.isOrganizer" to="/leagues/create"
          class="btn-primary self-start md:self-auto flex items-center gap-2">
          <span class="material-symbols-outlined">add</span>
          Crear Liga
        </NuxtLink>
      </div>

      <!-- Filters Bar -->
      <div
        class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-2 mb-8 flex flex-col md:flex-row gap-4 overflow-x-auto">
        <div class="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
          <button v-for="status in ['active', 'inactive', 'finished']" :key="status"
            @click="filters.status = filters.status === status ? '' : status"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300"
            :class="filters.status === status ? 'bg-white dark:bg-surface-dark-alt text-black dark:text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
            {{ getStatusText(status) }}
          </button>
        </div>

        <div class="h-px md:h-auto md:w-px bg-border-light dark:bg-border-dark"></div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button v-for="sport in sports" :key="sport.id"
            @click="filters.sport_id = filters.sport_id === sport.id ? '' : sport.id"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:border-primary-500 transition-colors whitespace-nowrap"
            :class="filters.sport_id === sport.id ? 'bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-500' : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark'">
            <span class="text-sm font-bold">{{ sport.name }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="leagueStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i"
          class="h-64 bg-surface-light dark:bg-surface-dark rounded-2xl animate-pulse border border-border-light dark:border-border-dark">
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="leagueStore.error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p class="text-red-500 font-bold">{{ leagueStore.error }}</p>
        <button @click="fetchLeagues" class="mt-4 text-sm font-bold underline hover:text-red-400">Intentar de
          nuevo</button>
      </div>

      <!-- Grid -->
      <div v-else-if="leagueStore.leagues.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(league, index) in leagueStore.leagues" :key="league.id"
          class="group relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark hover:border-primary-500/50 transition-all duration-300 hover:shadow-neon cursor-pointer"
          :class="`stagger-${Math.min(index + 1, 8)}`" @click="goToLeague(league.id)">
          <!-- Status Badge -->
          <div class="absolute top-4 right-4 z-10">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border"
              :class="{
                'bg-green-500/20 text-green-500 border-green-500/30': league.status === 'active',
                'bg-yellow-500/20 text-yellow-500 border-yellow-500/30': league.status === 'inactive',
                'bg-gray-500/20 text-gray-400 border-gray-500/30': league.status === 'finished'
              }">
              {{ getStatusText(league.status) }}
            </span>
          </div>

          <!-- Card Header/Image Placeholder -->
          <div
            class="h-32 bg-surface-light dark:bg-surface-dark-alt flex items-center justify-center relative overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-light dark:to-surface-dark opacity-50">
            </div>
            <div class="text-5xl transform group-hover:scale-110 transition-transform duration-500 text-primary-500">
              <span class="material-symbols-outlined" style="font-size: 48px">emoji_events</span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 pt-2">
            <div class="mb-4">
              <span
                class="text-xs font-bold text-primary-600 dark:text-primary-500 uppercase tracking-wider mb-1 block">
                {{ league.sport_name }}
              </span>
              <h3
                class="text-xl font-bold text-text-primary-light dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                {{ league.name }}
              </h3>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <span class="material-symbols-outlined text-lg">location_on</span>
                </div>
                <span class="font-medium">{{ league.location || 'Ubicación no especificada' }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <span class="material-symbols-outlined text-lg">person</span>
                </div>
                <span class="font-medium">{{ league.organizer_name }}</span>
              </div>
            </div>

            <button
              class="w-full py-3 rounded-xl bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-sm font-bold uppercase tracking-wide text-text-primary-light dark:text-white hover:bg-primary-500 hover:text-black hover:border-primary-500 transition-all duration-300 flex items-center justify-center gap-2">
              <span>Ver Detalles</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else
        class="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark border-dashed">
        <div
          class="w-24 h-24 mx-auto bg-surface-light dark:bg-surface-dark-alt rounded-full flex items-center justify-center mb-6">
          <span
            class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark">emoji_events</span>
        </div>
        <h3 class="text-2xl font-bold text-text-primary-light dark:text-white mb-2">No se encontraron ligas</h3>
        <p class="text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-md mx-auto">
          Intenta ajustar los filtros o crea una nueva liga para comenzar.
        </p>
        <NuxtLink v-if="authStore.isOrganizer" to="/leagues/create" class="btn-primary inline-flex items-center gap-2">
          <span class="material-symbols-outlined">add</span>
          Crear Liga
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const leagueStore = useLeagueStore();
const authStore = useAuthStore();
const router = useRouter();

const filters = ref({
  status: '',
  sport_id: '' as string | number
});

const sports = [
  { id: 1, name: 'Fútbol' },
  { id: 2, name: 'Baloncesto' },
  { id: 3, name: 'Tenis' },
  { id: 4, name: 'Voleibol' },
  { id: 5, name: 'Béisbol' }
];

const fetchLeagues = () => {
  const params: any = {};
  if (filters.value.status) params.status = filters.value.status;
  if (filters.value.sport_id) params.sport_id = parseInt(filters.value.sport_id as string);

  leagueStore.fetchLeagues(params);
};

const goToLeague = (id: number) => {
  router.push(`/leagues/${id}`);
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Activas',
    inactive: 'Inactivas',
    finished: 'Finalizadas'
  };
  return statusMap[status] || status;
};

// Watch filters to trigger fetch
watch(filters, () => {
  fetchLeagues();
}, { deep: true });

onMounted(() => {
  fetchLeagues();
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
