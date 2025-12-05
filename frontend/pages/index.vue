<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">


      <div class="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex gap-3">
          <button v-for="league in leagues" :key="league.id"
            class="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap">
            <span class="material-symbols-outlined text-lg">{{ getSportIcon(league.sport_name) }}</span>
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
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">
                {{ $t('home.my_leagues') }}
              </h3>
            </div>
            <div class="p-2">
              <NuxtLink v-for="league in leagues" :key="league.id" :to="`/leagues/${league.id}`"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                <div
                  class="w-8 h-8 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg group-hover:bg-primary-500 group-hover:text-black transition-colors">
                  <span class="material-symbols-outlined text-lg">{{ getSportIcon(league.sport_name) }}</span>
                </div>
                <span
                  class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark group-hover:text-text-primary-light dark:group-hover:text-white transition-colors truncate">
                  {{ league.name }}
                </span>
              </NuxtLink>

              <button
                class="w-full mt-2 flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-primary-600 dark:text-primary-500">
                <div
                  class="w-8 h-8 shrink-0 rounded-full border border-dashed border-primary-500/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-sm">add</span>
                </div>
                <span class="text-sm font-bold">{{ $t('home.join_league') }}</span>
              </button>
            </div>
          </div>

          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div
              class="p-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
              <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-xs">
                {{ $t('home.sports') }}
              </h3>
            </div>
            <div class="p-2">
              <div v-for="sport in sports" :key="sport.name"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-lg w-8 text-center shrink-0">{{ sport.icon }}</span>
                <span
                  class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{{ sport.name }}</span>
              </div>
            </div>
          </div>
        </aside>


        <main class="lg:col-span-9 xl:col-span-7 space-y-6">
          <!-- Date Filter -->
          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-2 flex items-center justify-between">
            <button @click="handlePrevDate"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2">
              <button v-for="date in dateOptions" :key="date.value" @click="selectedDate = date.value"
                class="px-4 py-1.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap" :class="selectedDate === date.value
                  ? 'bg-primary-500 text-black shadow-neon'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'">
                {{ date.label }}
              </button>
            </div>
            <button @click="handleNextDate"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Loading State -->
            <div v-if="loadingMatches" class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-32 bg-surface-light dark:bg-surface-dark rounded-xl animate-pulse">
              </div>
            </div>

            <div v-else-if="liveMatches.length === 0 && upcomingMatches.length === 0"
              class="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
              <span
                class="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark mb-2">event_busy</span>
              <p class="text-text-secondary-light dark:text-text-secondary-dark font-medium">
                {{ $t('home.no_matches_date') }}</p>
            </div>

            <!-- Live Matches -->
            <div v-if="liveMatches.length > 0"
              class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              <div
                class="px-4 py-3 bg-red-500/10 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <h3 class="font-bold text-red-500 text-sm uppercase tracking-wider">{{ $t('home.live') }}</h3>
              </div>
              <div class="divide-y divide-border-light dark:divide-border-dark">
                <div v-for="match in liveMatches" :key="match.id"
                  class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  @click="$router.push(`/matches/${match.id}`)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="flex flex-col items-center min-w-[60px]">
                        <span class="text-red-500 font-bold text-xs animate-pulse">LIVE</span>
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <img v-if="match.home_team_logo" :src="match.home_team_logo"
                              class="w-6 h-6 object-contain" />
                            <div v-else class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span
                              class="font-medium text-text-primary-light dark:text-white">{{ match.home_team_name }}</span>
                          </div>
                          <span
                            class="font-bold text-lg text-text-primary-light dark:text-white">{{ match.home_score }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <img v-if="match.away_team_logo" :src="match.away_team_logo"
                              class="w-6 h-6 object-contain" />
                            <div v-else class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span
                              class="font-medium text-text-primary-light dark:text-white">{{ match.away_team_name }}</span>
                          </div>
                          <span
                            class="font-bold text-lg text-text-primary-light dark:text-white">{{ match.away_score }}</span>
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

            <!-- Upcoming Matches -->
            <div v-if="upcomingMatches.length > 0"
              class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              <div
                class="px-4 py-3 bg-surface-light dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark">
                <h3 class="font-bold text-text-primary-light dark:text-white text-sm uppercase tracking-wider">
                  {{ $t('home.upcoming_matches') }}</h3>
              </div>
              <div class="divide-y divide-border-light dark:divide-border-dark">
                <div v-for="match in upcomingMatches" :key="match.id"
                  class="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  @click="$router.push(`/matches/${match.id}`)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="flex flex-col items-center min-w-[60px]">
                        <span class="text-text-secondary-light dark:text-text-secondary-dark font-medium text-xs">
                          {{ new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <img v-if="match.home_team_logo" :src="match.home_team_logo"
                              class="w-6 h-6 object-contain" />
                            <div v-else class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span
                              class="font-medium text-text-primary-light dark:text-white">{{ match.home_team_name }}</span>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <img v-if="match.away_team_logo" :src="match.away_team_logo"
                              class="w-6 h-6 object-contain" />
                            <div v-else class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span
                              class="font-medium text-text-primary-light dark:text-white">{{ match.away_team_name }}</span>
                          </div>
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

          <!-- Featured Standings -->
          <div v-if="featuredTournament && featuredStandings.length > 0"
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div class="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <div class="flex flex-col">
                <h3 class="font-bold text-text-primary-light dark:text-white uppercase tracking-wider text-sm">
                  {{ featuredTournament.league_name }}
                </h3>
                <span
                  class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ featuredTournament.name }}</span>
              </div>
              <NuxtLink :to="`/tournaments/${featuredTournament.id}`"
                class="text-primary-600 dark:text-primary-500 text-xs font-bold hover:underline">
                {{ $t('home.view_all') }}
              </NuxtLink>
            </div>
            <div class="p-2">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                    <th class="text-left p-2 font-medium">#</th>
                    <th class="text-left p-2 font-medium">{{ $t('home.team') }}</th>
                    <th class="text-center p-2 font-medium">{{ $t('home.pts') }}</th>
                  </tr>
                </thead>
                <tbody class="text-text-primary-light dark:text-white">
                  <tr v-for="(team, index) in featuredStandings" :key="team.team_id"
                    class="border-b border-border-light dark:border-border-dark last:border-0">
                    <td class="p-2">{{ index + 1 }}</td>
                    <td class="p-2 flex items-center gap-2">
                      <img v-if="team.team_logo" :src="team.team_logo" class="w-4 h-4 object-contain" />
                      <div v-else class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <span class="truncate max-w-[120px]">{{ team.team_name }}</span>
                    </td>
                    <td class="p-2 text-center font-bold">{{ team.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </aside>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useNuxtApp } from '#app';
import { useI18n } from 'vue-i18n';

definePageMeta({
  layout: 'default'
});

const { $api } = useNuxtApp();
const { t } = useI18n();
const leagues = ref<any[]>([]);
const liveMatches = ref<any[]>([]);
const upcomingMatches = ref<any[]>([]);
const featuredStandings = ref<any[]>([]);
const featuredTournament = ref<any>(null);
const loading = ref(true);
const loadingMatches = ref(false);

const selectedDate = ref(new Date().toISOString().split('T')[0]);

const dateOptions = computed(() => {
  const dates = [];
  // Center around selectedDate
  const current = new Date(selectedDate.value + 'T00:00:00');

  // Generate 3 days before and 3 days after (total 7)
  for (let i = -3; i <= 3; i++) {
    const date = new Date(current);
    date.setDate(current.getDate() + i);

    // Handle timezone offset to keep local date
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    const value = localDate.toISOString().split('T')[0];

    let label = '';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) label = t('home.today');
    else if (date.toDateString() === tomorrow.toDateString()) label = t('home.tomorrow');
    else label = date.toLocaleDateString('es-HN', { weekday: 'short', day: 'numeric' });

    dates.push({ label, value });
  }
  return dates;
});

const handlePrevDate = () => {
  const date = new Date(selectedDate.value + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  const offset = date.getTimezoneOffset() * 60000;
  selectedDate.value = new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const handleNextDate = () => {
  const date = new Date(selectedDate.value + 'T00:00:00');
  date.setDate(date.getDate() + 1);
  const offset = date.getTimezoneOffset() * 60000;
  selectedDate.value = new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const sports = [
  { name: 'Fútbol', icon: 'sports_soccer' },
  { name: 'Baloncesto', icon: 'sports_basketball' },
  { name: 'Tenis', icon: 'sports_tennis' },
  { name: 'Voleibol', icon: 'sports_volleyball' },
  { name: 'Béisbol', icon: 'sports_baseball' }
];

const getSportIcon = (sportName: string): string => {
  const sport = sports.find(s => s.name.toLowerCase() === sportName?.toLowerCase());
  return sport?.icon || 'emoji_events';
};

const loadMatches = async () => {
  try {
    loadingMatches.value = true;
    // Load Live Matches
    const liveMatchesRes = await $api.get('/matches?status=live');
    if (liveMatchesRes.data.success) {
      liveMatches.value = liveMatchesRes.data.data;
    }

    // Load Scheduled Matches for selected date
    const upcomingMatchesRes = await $api.get(`/matches?status=scheduled&date=${selectedDate.value}`);
    if (upcomingMatchesRes.data.success) {
      upcomingMatches.value = upcomingMatchesRes.data.data;
    }
  } catch (error) {
    console.error('Error loading matches:', error);
  } finally {
    loadingMatches.value = false;
  }
};

const loadSidebarData = async () => {
  try {
    // Load Leagues
    const leaguesRes = await $api.get('/leagues');
    if (leaguesRes.data.success) {
      leagues.value = leaguesRes.data.data;
    }

    // Load Featured Standings (Find an active tournament)
    const tournamentsRes = await $api.get('/tournaments');
    if (tournamentsRes.data.success && tournamentsRes.data.data.length > 0) {
      // Pick the first one for now
      const tournament = tournamentsRes.data.data[0];
      featuredTournament.value = tournament;

      const standingsRes = await $api.get(`/standings?tournament_id=${tournament.id}`);
      if (standingsRes.data.success) {
        // Take top 5
        featuredStandings.value = standingsRes.data.data.standings.slice(0, 5);
      }
    }
  } catch (error) {
    console.error('Error loading sidebar data:', error);
  }
};

const loadData = async () => {
  loading.value = true;
  await Promise.all([loadMatches(), loadSidebarData()]);
  loading.value = false;
};

watch(selectedDate, () => {
  loadMatches();
});

onMounted(() => {
  loadData();
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
