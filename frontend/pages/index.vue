<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">


      <div class="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex gap-3">
          <button v-for="league in leagues" :key="league.id"
            class="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap">
            <span class="text-lg">{{ getSportEmoji(league.sport_name) }}</span>
            <span class="text-sm font-bold text-text-primary-light dark:text-white">{{ league.name }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">


        <aside class="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-6">
          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div
              class="p-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">Mis Ligas
              </h3>
            </div>
            <div class="p-2">
              <NuxtLink v-for="league in leagues" :key="league.id" :to="`/leagues/${league.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                <div
                  class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg group-hover:bg-primary-500 group-hover:text-black transition-colors">
                  {{ getSportEmoji(league.sport_name) }}
                </div>
                <span
                  class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-white transition-colors truncate">
                  {{ league.name }}
                </span>
              </NuxtLink>

              <button
                class="w-full mt-2 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-primary-600 dark:text-primary-500">
                <div
                  class="w-8 h-8 rounded-full border border-dashed border-primary-500/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm">add</span>
                </div>
                <span class="text-sm font-bold">Unirse a Liga</span>
              </button>
            </div>
          </div>

          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div
              class="p-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">Deportes
              </h3>
            </div>
            <div class="p-2">
              <div v-for="sport in sports" :key="sport.name"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span class="text-lg w-8 text-center">{{ sport.emoji }}</span>
                <span
                  class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{{ sport.name }}</span>
              </div>
            </div>
          </div>
        </aside>


        <main class="lg:col-span-9 xl:col-span-7 space-y-6">


          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-2 flex items-center justify-between overflow-x-auto">
            <div class="flex items-center gap-2">
              <button class="px-4 py-1.5 rounded-lg bg-primary-500 text-black text-sm font-bold shadow-neon">
                Hoy
              </button>
              <button
                class="px-4 py-1.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium transition-colors">
                Mañana
              </button>
              <button
                class="px-4 py-1.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium transition-colors">
                Sáb 24
              </button>
              <button
                class="px-4 py-1.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium transition-colors">
                Dom 25
              </button>
            </div>

            <div class="flex items-center gap-2 pl-4 border-l border-border-light dark:border-border-dark">
              <button
                class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span class="text-xs font-bold uppercase">En Vivo</span>
              </button>
            </div>
          </div>


          <div class="space-y-4">

            <div
              class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              <div
                class="px-4 py-3 bg-surface-light dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">⚽</span>
                  <div>
                    <h3 class="font-bold text-text-primary-light dark:text-white text-sm">Torneo Apertura 2024</h3>
                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Honduras</p>
                  </div>
                </div>
                <span
                  class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-sm cursor-pointer hover:text-primary-500">star</span>
              </div>

              <div class="divide-y divide-border-light dark:divide-border-dark">

                <div class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="flex flex-col items-center min-w-[60px]">
                        <span class="text-red-500 font-bold text-xs animate-pulse">78'</span>
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">Olimpia</span>
                          </div>
                          <span class="font-bold text-lg text-text-primary-light dark:text-white">2</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">Motagua</span>
                          </div>
                          <span class="font-bold text-lg text-text-primary-light dark:text-white">1</span>
                        </div>
                      </div>
                    </div>
                    <div class="pl-4 border-l border-border-light dark:border-border-dark ml-4">
                      <span
                        class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-500 transition-colors">chevron_right</span>
                    </div>
                  </div>
                </div>


                <div class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="flex flex-col items-center min-w-[60px]">
                        <span
                          class="text-text-secondary-light dark:text-text-secondary-dark font-medium text-xs">19:00</span>
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">Real España</span>
                          </div>
                          <span class="font-medium text-text-secondary-light dark:text-text-secondary-dark">-</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">Marathón</span>
                          </div>
                          <span class="font-medium text-text-secondary-light dark:text-text-secondary-dark">-</span>
                        </div>
                      </div>
                    </div>
                    <div class="pl-4 border-l border-border-light dark:border-border-dark ml-4">
                      <span
                        class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-500 transition-colors">chevron_right</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div
              class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              <div
                class="px-4 py-3 bg-surface-light dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🏀</span>
                  <div>
                    <h3 class="font-bold text-text-primary-light dark:text-white text-sm">Liga Bancaria</h3>
                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Baloncesto</p>
                  </div>
                </div>
                <span
                  class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-sm cursor-pointer hover:text-primary-500">star</span>
              </div>

              <div class="divide-y divide-border-light dark:divide-border-dark">
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="flex flex-col items-center min-w-[60px]">
                        <span
                          class="text-text-secondary-light dark:text-text-secondary-dark font-medium text-xs">FT</span>
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">BAC Credomatic</span>
                          </div>
                          <span class="font-bold text-text-primary-light dark:text-white">86</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span class="font-medium text-text-primary-light dark:text-white">Ficohsa</span>
                          </div>
                          <span class="font-bold text-text-secondary-light dark:text-text-secondary-dark">82</span>
                        </div>
                      </div>
                    </div>
                    <div class="pl-4 border-l border-border-light dark:border-border-dark ml-4">
                      <span
                        class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-500 transition-colors">chevron_right</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>


        <aside class="hidden xl:block xl:col-span-3 space-y-6">

          <PromoWidget />


          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">Tabla
                General</h3>
              <button class="text-primary-600 dark:text-primary-500 text-xs font-bold hover:underline">Ver Todo</button>
            </div>
            <div class="p-2">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                    <th class="text-left p-2 font-medium">#</th>
                    <th class="text-left p-2 font-medium">Equipo</th>
                    <th class="text-center p-2 font-medium">PTS</th>
                  </tr>
                </thead>
                <tbody class="text-text-primary-light dark:text-white">
                  <tr class="border-b border-border-light dark:border-border-dark last:border-0">
                    <td class="p-2">1</td>
                    <td class="p-2 flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      Olimpia
                    </td>
                    <td class="p-2 text-center font-bold">32</td>
                  </tr>
                  <tr class="border-b border-border-light dark:border-border-dark last:border-0">
                    <td class="p-2">2</td>
                    <td class="p-2 flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      Motagua
                    </td>
                    <td class="p-2 text-center font-bold">29</td>
                  </tr>
                  <tr class="border-b border-border-light dark:border-border-dark last:border-0">
                    <td class="p-2">3</td>
                    <td class="p-2 flex items-center gap-2">
                      <div class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      Marathón
                    </td>
                    <td class="p-2 text-center font-bold">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="p-4 border-b border-border-light dark:border-border-dark">
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">Noticias
              </h3>
            </div>
            <div class="divide-y divide-border-light dark:divide-border-dark">
              <div class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span class="text-xs text-primary-600 dark:text-primary-500 font-bold mb-1 block">Torneo Apertura</span>
                <h4 class="text-sm font-bold text-text-primary-light dark:text-white leading-snug">
                  Gran final se jugará este fin de semana en el Estadio Nacional
                </h4>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 block">Hace 2
                  horas</span>
              </div>
              <div class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span class="text-xs text-primary-600 dark:text-primary-500 font-bold mb-1 block">Fichajes</span>
                <h4 class="text-sm font-bold text-text-primary-light dark:text-white leading-snug">
                  Nuevo reglamento para inscripción de jugadores extranjeros
                </h4>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 block">Hace 5
                  horas</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'default'
});

const leagues = ref<any[]>([]);
const loading = ref(true);

const sports = [
  { name: 'Fútbol', emoji: '⚽' },
  { name: 'Baloncesto', emoji: '🏀' },
  { name: 'Tenis', emoji: '🎾' },
  { name: 'Voleibol', emoji: '🏐' },
  { name: 'Béisbol', emoji: '⚾' }
];

const getSportEmoji = (sportName: string): string => {
  const sport = sports.find(s => s.name.toLowerCase() === sportName?.toLowerCase());
  return sport?.emoji || '🏆';
};

const loadLeagues = async () => {
  try {
    loading.value = true;
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.apiUrl}/leagues`);
    const data = await response.json();

    if (data.success) {
      leagues.value = data.data;
    }
  } catch (error) {
    console.error('Error cargando ligas:', error);

    leagues.value = [
      { id: 1, name: 'Torneo Apertura 2024', sport_name: 'Fútbol', location: 'Honduras' },
      { id: 2, name: 'Liga Bancaria', sport_name: 'Baloncesto', location: 'Tegucigalpa' },
      { id: 3, name: 'Copa Intercolegial', sport_name: 'Voleibol', location: 'San Pedro Sula' },
      { id: 4, name: 'Liga Master', sport_name: 'Fútbol', location: 'La Ceiba' },
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadLeagues();
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
