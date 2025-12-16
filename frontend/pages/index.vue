<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">




      <div class="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex gap-3">
          <NuxtLink v-for="league in leagues" :key="league.id" :to="localePath(`/leagues/${league.id}`)"
            class="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark rounded-full border border-border-light dark:border-border-dark whitespace-nowrap transition-all duration-300 hover:border-primary-500 hover:shadow-neon">
            <span class="material-symbols-outlined text-lg">{{ getSportIcon(league.sport_name) }}</span>
            <span class="text-sm font-bold text-text-primary-light dark:text-white">{{ league.name }}</span>
          </NuxtLink>
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
              <NuxtLink v-for="league in leagues" :key="league.id" :to="localePath(`/leagues/${league.id}`)"
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
              <div v-for="sport in sports" :key="sport.id" @click="selectSport(sport.id)"
                class="flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer" :class="selectedSport === sport.id
                  ? 'bg-primary-500 text-black font-bold shadow-neon'
                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark'">
                <span
                  class="material-symbols-outlined text-lg w-8 text-center shrink-0">{{ sport.icon || getSportIcon(sport.name) }}</span>
                <span class="text-sm font-medium">{{ getSportName(sport.name) }}</span>
              </div>
            </div>
          </div>
        </aside>


        <main class="lg:col-span-9 xl:col-span-7 space-y-3">
          <!-- Date Filter -->
          <div
            class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-1.5 flex items-center justify-between">
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

          <!-- Sports Filter Cards -->
          <div class="relative group/scroll">
            <!-- Left Arrow -->
            <button @click="scrollSports('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-white shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
              :class="{ 'hidden': !canScrollLeft }">
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            <!-- Scroll Container -->
            <div ref="sportsContainer" @scroll="checkScroll"
              class="flex overflow-x-auto gap-2 pb-0 scrollbar-hide -mx-2 px-2 scroll-smooth">
              <button v-for="sport in sports" :key="sport.id" @click="selectSport(sport.id)"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 flex-shrink-0 group relative overflow-hidden hover:scale-105 active:scale-95"
                :class="selectedSport === sport.id
                  ? 'bg-primary-500 border-primary-500 shadow-neon scale-105'
                  : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark hover:border-primary-500 hover:shadow-neon'">

                <!-- Background Glow for Active -->
                <div v-if="selectedSport === sport.id" class="absolute inset-0 bg-white/20"></div>

                <!-- Hover Glow for Inactive -->
                <div v-else class="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors">
                </div>

                <div class="flex flex-col items-center justify-center w-full relative z-10">
                  <span class="text-xs font-bold uppercase tracking-wider text-center transition-colors"
                    :class="selectedSport === sport.id ? 'text-black' : 'text-text-primary-light dark:text-white group-hover:text-primary-500'">
                    {{ getSportName(sport.name) }}
                  </span>
                </div>
              </button>
            </div>

            <!-- Right Arrow -->
            <button @click="scrollSports('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-white shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity disabled:opacity-0"
              :class="{ 'hidden': !canScrollRight }">
              <span class="material-symbols-outlined text-sm">chevron_right</span>
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
                {{ $t('home.no_matches_date') }}
              </p>
            </div>

            <!-- Live Matches Section (Grouped) -->
            <div v-if="liveMatches.length > 0" class="space-y-4">
              <div class="flex items-center gap-2 px-1">
                <span class="relative flex h-3 w-3">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h2 class="text-sm font-black text-red-500 uppercase tracking-widest">{{ $t('home.live_matches') }}</h2>
              </div>

              <div v-for="group in groupMatches(liveMatches)" :key="group.id"
                class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
                <!-- Group Header -->
                <div @click="toggleGroup(group.id)"
                  class="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-b border-border-light dark:border-border-dark flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-gray-500 text-lg">emoji_events</span>
                    <div class="flex flex-col leading-none">
                      <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ group.league_name }}</span>
                      <span
                        class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">{{ group.tournament_name }}</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-gray-400 text-sm transition-transform duration-300"
                    :class="{ '-rotate-90': isGroupCollapsed(group.id) }">expand_more</span>
                </div>
                <!-- Matches List -->
                <div v-show="!isGroupCollapsed(group.id)" class="p-2 space-y-1 transition-all">
                  <MatchCard v-for="match in group.matches" :key="match.id" :match="match" />
                </div>
              </div>
            </div>

            <!-- Upcoming Matches Section (Grouped) -->
            <div v-if="upcomingMatches.length > 0" class="space-y-4">
              <div class="flex items-center gap-2 px-1 pt-4">
                <span class="material-symbols-outlined text-primary-500">calendar_month</span>
                <h2 class="text-sm font-black text-text-primary-light dark:text-white uppercase tracking-widest">
                  {{ $t('home.upcoming_matches') }}
                </h2>
              </div>

              <div v-for="group in groupMatches(upcomingMatches)" :key="group.id"
                class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
                <!-- Group Header -->
                <div @click="toggleGroup(group.id)"
                  class="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-b border-border-light dark:border-border-dark flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-gray-500 text-lg">emoji_events</span>
                    <div class="flex flex-col leading-none">
                      <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ group.league_name }}</span>
                      <span
                        class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">{{ group.tournament_name }}</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-gray-400 text-sm transition-transform duration-300"
                    :class="{ '-rotate-90': isGroupCollapsed(group.id) }">expand_more</span>
                </div>
                <!-- Matches List -->
                <div v-show="!isGroupCollapsed(group.id)" class="p-2 space-y-1 transition-all">
                  <MatchCard v-for="match in group.matches" :key="match.id" :match="match" />
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
              <NuxtLink :to="localePath(`/tournaments/${featuredTournament.id}`)"
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
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useNuxtApp } from '#app';
import { useI18n } from 'vue-i18n';

definePageMeta({
  layout: 'default'
});

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const leagues = ref<any[]>([]);
const sports = ref<any[]>([]);
const liveMatches = ref<any[]>([]);
const upcomingMatches = ref<any[]>([]);
const featuredStandings = ref<any[]>([]);
const featuredTournament = ref<any>(null);
const loading = ref(true);
const loadingMatches = ref(false);
const selectedSport = ref<number | null>(null);

const { locale } = useI18n();

const getSportIcon = (sportName: string): string => {
  const map: Record<string, string> = {
    'fútbol': 'sports_soccer',
    'baloncesto': 'sports_basketball',
    'tenis': 'sports_tennis',
    'voleibol': 'sports_volleyball',
    'béisbol': 'sports_baseball',
    'football': 'sports_soccer',
    'basketball': 'sports_basketball',
    'tennis': 'sports_tennis',
    'volleyball': 'sports_volleyball',
    'baseball': 'sports_baseball'
  };
  return map[sportName?.toLowerCase()] || 'emoji_events';
};

const getSportName = (sportName: string): string => {
  const map: Record<string, string> = {
    'fútbol': 'football',
    'baloncesto': 'basketball',
    'tenis': 'tennis',
    'voleibol': 'volleyball',
    'béisbol': 'baseball',
    'football': 'football',
    'basketball': 'basketball',
    'tennis': 'tennis',
    'volleyball': 'volleyball',
    'baseball': 'baseball',
    'golf': 'golf',
    'pádel': 'padel',
    'padel': 'padel'
  };

  const key = map[sportName?.toLowerCase()];
  // If we have a translation key, return the translated string
  // Otherwise try to find it in sports_list directly, or fallback to original name
  if (key) return t(`sports_list.${key}`);

  return sportName;
};

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const selectedDate = ref(getLocalDateString());

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
    else label = date.toLocaleDateString(locale.value, { weekday: 'short', day: 'numeric' });

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

const selectSport = (sportId: number | null) => {
  selectedSport.value = selectedSport.value === sportId ? null : sportId;
  loadMatches();
};

const loadMatches = async () => {
  try {
    loadingMatches.value = true;
    let query = `?status=live`;
    if (selectedSport.value) query += `&sport_id=${selectedSport.value}`;

    // Load Live Matches
    const liveMatchesRes = await $api.get(`/matches${query}`);
    if (liveMatchesRes.data.success) {
      liveMatches.value = liveMatchesRes.data.data;
    }

    // Load Scheduled Matches for selected date
    query = `?status=scheduled&date=${selectedDate.value}`;
    if (selectedSport.value) query += `&sport_id=${selectedSport.value}`;

    const upcomingMatchesRes = await $api.get(`/matches${query}`);
    if (upcomingMatchesRes.data.success) {
      upcomingMatches.value = upcomingMatchesRes.data.data;
    }
  } catch (error) {
    console.error('Error loading matches:', error);
  } finally {
    loadingMatches.value = false;
  }
};

const loadSports = async () => {
  try {
    const response = await $api.get('/sports');
    if (response.data.success) {
      sports.value = response.data.data;
    }
  } catch (error) {
    console.error('Error loading sports:', error);
  }
};

const loadSidebarData = async () => {
  try {
    // Load Sports
    await loadSports();

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
  nextTick(() => {
    checkScroll();
  });
};

watch(selectedDate, () => {
  loadMatches();
});

// Scroll Logic
const sportsContainer = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const checkScroll = () => {
  if (!sportsContainer.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = sportsContainer.value;
  canScrollLeft.value = scrollLeft > 0;
  // Use a small buffer (1px) for float precision issues
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 1;
};

const scrollSports = (direction: 'left' | 'right') => {
  if (!sportsContainer.value) return;
  const scrollAmount = 300; // Adjust scroll distance as needed
  if (direction === 'left') {
    sportsContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    sportsContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

const collapsedGroups = ref<Set<string>>(new Set())

const toggleGroup = (groupId: string) => {
  if (collapsedGroups.value.has(groupId)) {
    collapsedGroups.value.delete(groupId)
  } else {
    collapsedGroups.value.add(groupId)
  }
}

const isGroupCollapsed = (groupId: string) => {
  return collapsedGroups.value.has(groupId)
}

const groupMatches = (matches: any[]) => {
  const groups: Record<string, any> = {}

  matches.forEach(match => {
    // Falls back to empty string if missing, no "Tournament" text
    const league = match.league_name || ''
    const tournament = match.tournament_name || ''
    // Create a predictable ID for grouping
    const key = `${league}-${tournament}`.replace(/\s+/g, '-').toLowerCase()

    if (!groups[key]) {
      groups[key] = {
        id: key,
        league_name: league,
        tournament_name: tournament,
        matches: []
      }
    }
    groups[key].matches.push(match)
  })

  return Object.values(groups)
}

onMounted(() => {
  loadData();
  window.addEventListener('resize', checkScroll);
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
