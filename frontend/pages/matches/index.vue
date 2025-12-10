<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
            {{ $t('matches_page.title') }} <span class="text-primary-500">{{ $t('matches_page.title_highlight')
            }}</span>
          </h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            {{ $t('matches_page.subtitle') }}
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-border-light dark:border-border-dark">
          <button @click="viewMode = 'list'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
            :class="viewMode === 'list' ? 'bg-primary-500 text-black shadow-neon' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
            {{ $t('matches_page.views.list') }}
          </button>
          <button @click="viewMode = 'calendar'"
            class="px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300"
            :class="viewMode === 'calendar' ? 'bg-primary-500 text-black shadow-neon' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
            {{ $t('matches_page.views.calendar') }}
          </button>
        </div>
      </div>


      <div v-if="viewMode === 'list'"
        class="flex items-center justify-between bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-4 mb-8">
        <button @click="handlePrevDate"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <div class="flex-1 flex justify-center items-center gap-1 sm:gap-4 overflow-hidden px-2">
          <div v-for="(date, index) in dates" :key="date.value" @click="selectedDate = date.value"
            class="flex flex-col items-center gap-1 cursor-pointer group transition-all duration-300 rounded-xl py-2 w-12 sm:w-14"
            :class="[
              selectedDate === date.value ? 'bg-primary-500/10' : 'hover:bg-gray-100 dark:hover:bg-white/5',
              (index === 0 || index === 6) ? 'hidden md:flex' :
                (index === 1 || index === 5) ? 'hidden sm:flex' : 'flex'
            ]">
            <span class="text-[10px] md:text-xs font-bold transition-colors uppercase truncate w-full text-center"
              :class="selectedDate === date.value ? 'text-primary-500' : 'text-text-secondary-light dark:text-text-secondary-dark'">
              {{ date.label }}
            </span>
            <span
              class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-lg transition-all duration-300"
              :class="selectedDate === date.value ? 'bg-primary-500 text-black shadow-neon scale-110' : 'bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white'">
              {{ date.day }}
            </span>
          </div>
        </div>

        <button @click="handleNextDate"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>


      <div v-if="viewMode === 'list'" class="space-y-6">

        <div v-for="league in filteredLeagues" :key="league.name"
          class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
          <div
            class="px-6 py-4 bg-surface-light dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-2xl">emoji_events</span>
              <h3 class="font-bold text-text-primary-light dark:text-white">{{ league.name }}</h3>
            </div>
            <NuxtLink :to="localePath(`/leagues/${league.id}`)"
              class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 transition-colors uppercase tracking-wide">
              {{ $t('matches_page.view_table') }}
            </NuxtLink>
          </div>

          <div class="divide-y divide-border-light dark:divide-border-dark">
            <div v-for="match in league.matches" :key="match.id" @click="navigateTo(localePath(`/matches/${match.id}`))"
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
                    <div
                      class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img v-if="match.home_team_logo" :src="match.home_team_logo" class="w-full h-full object-cover">
                    </div>
                  </div>

                  <div class="flex items-center justify-center gap-3">
                    <span
                      class="text-2xl md:text-3xl font-black text-text-primary-light dark:text-white">{{ match.home_score }}</span>
                    <span class="text-text-secondary-light dark:text-text-secondary-dark font-bold">-</span>
                    <span
                      class="text-2xl md:text-3xl font-black text-text-primary-light dark:text-white">{{ match.away_score }}</span>
                  </div>

                  <div class="flex items-center justify-start gap-4 text-left">
                    <div
                      class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img v-if="match.away_team_logo" :src="match.away_team_logo" class="w-full h-full object-cover">
                    </div>
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

      <!-- Calendar View -->
      <div v-else
        class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
        <!-- Calendar Header -->
        <div class="p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <button @click="changeMonth(-1)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 class="text-lg font-bold text-text-primary-light dark:text-white capitalize">
            {{ currentMonthName }} {{ currentYear }}
          </h3>
          <button @click="changeMonth(1)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div
          class="grid grid-cols-7 text-center border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/5">
          <div v-for="day in weekDays" :key="day"
            class="py-2 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 auto-rows-fr">
          <div v-for="(day, index) in calendarDays" :key="index"
            class="min-h-[100px] p-2 border-b border-r border-border-light dark:border-border-dark relative hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            :class="{ 'bg-gray-50/50 dark:bg-white/5': !day.isCurrentMonth }" @click="selectDateFromCalendar(day.date)">

            <span class="text-sm font-bold" :class="{
              'text-primary-500': isToday(day.date),
              'text-text-secondary-light dark:text-text-secondary-dark': !day.isCurrentMonth,
              'text-text-primary-light dark:text-white': day.isCurrentMonth && !isToday(day.date)
            }">
              {{ day.dayNumber }}
            </span>

            <!-- Matches Dots/List -->
            <div class="mt-1 space-y-1">
              <div v-for="match in day.matches.slice(0, 3)" :key="match.id"
                class="text-[10px] truncate px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                {{ match.home_team_name }} vs {{ match.away_team_name }}
              </div>
              <div v-if="day.matches.length > 3"
                class="text-[10px] text-text-secondary-light dark:text-text-secondary-dark pl-1">
                +{{ day.matches.length - 3 }} más
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMatchStore } from '@/stores/match';

const matchStore = useMatchStore();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const viewMode = ref('list'); // 'list' | 'calendar'

// Calendar State
const currentMonth = ref(new Date());

const weekDays = computed(() => {
  const days = [];
  const curr = new Date();
  // Set to a known Sunday
  const first = curr.getDate() - curr.getDay();
  for (let i = 0; i < 7; i++) {
    const next = new Date(curr.getTime());
    next.setDate(first + i);
    days.push(next.toLocaleDateString(locale.value, { weekday: 'short' }).toUpperCase());
  }
  return days;
});

const currentMonthName = computed(() => {
  return currentMonth.value.toLocaleDateString(locale.value, { month: 'long' });
});

const currentYear = computed(() => {
  return currentMonth.value.getFullYear();
});

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: date,
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      matches: getMatchesForDate(date)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: date,
      dayNumber: i,
      isCurrentMonth: true,
      matches: getMatchesForDate(date)
    });
  }

  // Next month days
  const remainingCells = 42 - days.length; // 6 rows * 7 cols
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: date,
      dayNumber: i,
      isCurrentMonth: false,
      matches: getMatchesForDate(date)
    });
  }

  return days;
});

const getMatchesForDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  return matchStore.matches.filter(match => {
    const mDate = new Date(match.match_date);
    const mYear = mDate.getFullYear();
    const mMonth = String(mDate.getMonth() + 1).padStart(2, '0');
    const mDay = String(mDate.getDate()).padStart(2, '0');
    const matchDateString = `${mYear}-${mMonth}-${mDay}`;

    return matchDateString === dateString;
  });
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const getMonthLabel = (date: Date) => {
  return date.toLocaleDateString(locale.value, { month: 'long', year: 'numeric' });
};

const changeMonth = (delta: number) => {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() + delta);
  currentMonth.value = newDate;
};

const selectDateFromCalendar = (date: Date) => {
  selectedDate.value = date.toISOString().split('T')[0];
  viewMode.value = 'list';
};

// List View State
// Initialize with local date to avoid timezone issues
const getLocalDateString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

const selectedDate = ref(getLocalDateString());

const dates = computed(() => {
  const daysArr = [];
  // Parse the selected date string (YYYY-MM-DD) as a local date
  // Appending T00:00:00 ensures it's treated as local time, not UTC
  const current = new Date(selectedDate.value + 'T00:00:00');

  // Generate 3 days before and 3 days after (total 7)
  for (let i = -3; i <= 3; i++) {
    const date = new Date(current);
    date.setDate(current.getDate() + i);

    // We need to format it back to YYYY-MM-DD
    // Since 'date' is local, we need to be careful with toISOString() which converts to UTC
    // So we manually construct the ISO string from local parts or adjust offset
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    const value = localDate.toISOString().split('T')[0];

    const day = date.getDate().toString();
    const label = getDayLabel(date);

    daysArr.push({ label, value, day });
  }
  return daysArr;
});

const fetchMatches = async () => {
  if (viewMode.value === 'calendar') {
    // Fetch all matches for calendar view
    await matchStore.fetchMatches({});
  } else {
    // Fetch specific date for list view
    await matchStore.fetchMatches({ date: selectedDate.value });
  }
};

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

const getDayLabel = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return t('home.today').toUpperCase().slice(0, 3);
  if (date.toDateString() === tomorrow.toDateString()) return t('home.tomorrow').toUpperCase().slice(0, 3);

  return date.toLocaleDateString(locale.value, { weekday: 'short' }).toUpperCase();
};

watch(selectedDate, () => {
  if (viewMode.value === 'list') {
    fetchMatches();
  }
});

watch(viewMode, (newMode) => {
  fetchMatches();
});

onMounted(() => {
  fetchMatches();
});

// Group matches by tournament
const filteredLeagues = computed(() => {
  if (!matchStore.matches.length) return [];

  const groups: Record<string, any> = {};

  matchStore.matches.forEach(match => {
    const tournamentName = match.tournament_name || t('common.unknown_tournament');

    if (!groups[tournamentName]) {
      groups[tournamentName] = {
        id: match.tournament_id,
        name: tournamentName,
        matches: []
      };
    }

    // Format time and status
    const matchDate = new Date(match.match_date);
    const time = matchDate.toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' });

    let statusText = '';
    if (match.status === 'live') statusText = t('home.live');
    else if (match.status === 'finished') statusText = t('tournaments_page.status.finished');
    else statusText = t('tournaments_page.status.upcoming');

    groups[tournamentName].matches.push({
      ...match,
      time: match.status === 'live' ? 'LIVE' : (match.status === 'finished' ? 'FT' : time),
      date: statusText,
      home_team: match.home_team_name,
      away_team: match.away_team_name,
      home_score: match.home_score !== null ? match.home_score : '-',
      away_score: match.away_score !== null ? match.away_score : '-'
    });
  });

  return Object.values(groups);
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
