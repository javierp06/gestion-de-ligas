<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientOnly>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Welcome Header -->
                <div
                    class="mb-8 animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1
                            class="text-3xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight">
                            {{ $t('dashboard.welcome', { name: authStore.user?.name || 'Usuario' }) }}
                        </h1>
                        <p
                            class="text-text-secondary-light dark:text-text-secondary-dark mt-1 font-medium flex items-center gap-2">
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                                :class="getRoleBadgeClass(authStore.user?.role || 'user')">
                                <span
                                    class="material-symbols-outlined text-sm mr-1">{{ getRoleIcon(authStore.user?.role || 'user') }}</span>
                                {{ getRoleText(authStore.user?.role || 'user') }}
                            </span>
                        </p>
                    </div>

                    <button @click="navigateTo(localePath('/leagues/create'))"
                        class="hidden md:flex px-6 py-3 bg-primary-500 text-black font-bold rounded-xl shadow-neon hover:scale-105 transition-transform items-center gap-2 uppercase tracking-wide text-sm">
                        <span class="material-symbols-outlined">add_circle</span>
                        {{ $t('dashboard.organizer.create_first_league') }}
                    </button>
                </div>

                <!-- 1. Stats Grid (Universal) -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Show different stats based on what data is available -->
                    <div class="animate-slide-up stagger-1">
                        <StatsCard :title="$t('dashboard.organizer.my_leagues')" :value="myLeagues?.length || 0"
                            icon="emoji_events" color="blue" />
                    </div>
                    <div class="animate-slide-up stagger-2">
                        <StatsCard :title="$t('dashboard.stats.active_tournaments')" :value="myTournaments?.length || 0"
                            icon="sports" color="green" />
                    </div>
                    <div class="animate-slide-up stagger-3">
                        <StatsCard :title="'Equipos Favoritos'" :value="favoritesStore.teams.length" icon="favorite"
                            color="red" />
                    </div>
                    <div class="animate-slide-up stagger-4">
                        <StatsCard :title="$t('dashboard.stats.today_matches')" :value="stats.todayMatches || 0"
                            icon="today" color="orange" />
                    </div>
                </div>

                <!-- 2. My Leagues (If Any) -->
                <div v-if="myLeagues && myLeagues.length > 0"
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 mb-8 animate-slide-up">
                    <div class="flex items-center justify-between mb-6">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <span class="material-symbols-outlined text-blue-500">emoji_events</span>
                            {{ $t('dashboard.organizer.my_leagues') }}
                        </h2>
                        <button @click="navigateTo(localePath('/admin/leagues/create'))"
                            class="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
                            Crear Nueva
                            <span class="material-symbols-outlined text-lg">add</span>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LeagueCard v-for="league in myLeagues" :key="league.id" :league="league"
                            @click="navigateTo(`/leagues/${league.id}`)" />
                    </div>
                </div>

                <!-- 3. Favorites Section (New) -->
                <div v-if="favoritesStore.leagues.length > 0 || favoritesStore.teams.length > 0"
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 mb-8 animate-slide-up">
                    <h2
                        class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                        <span class="material-symbols-outlined text-red-500">favorite</span>
                        Mis Favoritos
                    </h2>

                    <!-- Favorite Leagues -->
                    <div v-if="favoritesStore.leagues.length > 0" class="mb-6">
                        <h3
                            class="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-3">
                            Ligas</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <LeagueCard v-for="league in favoritesStore.leagues" :key="league.id" :league="league"
                                @click="navigateTo(`/leagues/${league.id}`)" />
                        </div>
                    </div>

                    <!-- Favorite Teams -->
                    <div v-if="favoritesStore.teams.length > 0">
                        <h3
                            class="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-3">
                            Equipos</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div v-for="team in favoritesStore.teams" :key="team.id"
                                @click="navigateTo(`/teams/${team.id}`)"
                                class="bg-background-light dark:bg-surface-dark-alt p-4 rounded-xl border border-border-light dark:border-border-dark flex items-center gap-4 cursor-pointer hover:border-primary-500 transition-colors group">
                                <img :src="team.logo || 'https://ui-avatars.com/api/?name=' + team.name"
                                    class="w-12 h-12 rounded-full object-cover shadow-sm" />
                                <div>
                                    <h4
                                        class="font-bold text-text-primary-light dark:text-white group-hover:text-primary-500 transition-colors">
                                        {{ team.name }}</h4>
                                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                        {{ team.short_name || 'Team' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. Quick Actions / Explore (Universal) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div @click="navigateTo('/leagues')"
                        class="group bg-surface-light dark:bg-surface-dark rounded-3xl p-6 cursor-pointer border border-border-light dark:border-border-dark hover:border-primary-500/50 hover:shadow-neon transition-all duration-300 animate-slide-up stagger-1 relative overflow-hidden">
                        <div
                            class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <span class="material-symbols-outlined text-8xl text-primary-500">emoji_events</span>
                        </div>
                        <div
                            class="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span
                                class="material-symbols-outlined text-primary-600 dark:text-primary-500 text-3xl">emoji_events</span>
                        </div>
                        <h3
                            class="text-xl font-bold text-text-primary-light dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                            {{ $t('dashboard.user.explore_leagues') }}
                        </h3>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                            Encuentra ligas para unirte.
                        </p>
                    </div>

                    <div @click="navigateTo('/tournaments')"
                        class="group bg-surface-light dark:bg-surface-dark rounded-3xl p-6 cursor-pointer border border-border-light dark:border-border-dark hover:border-green-500/50 hover:shadow-lg transition-all duration-300 animate-slide-up stagger-2 relative overflow-hidden">
                        <div
                            class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <span class="material-symbols-outlined text-8xl text-green-500">trophy</span>
                        </div>
                        <div
                            class="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span
                                class="material-symbols-outlined text-green-600 dark:text-green-500 text-3xl">trophy</span>
                        </div>
                        <h3
                            class="text-xl font-bold text-text-primary-light dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                            {{ $t('dashboard.user.view_tournaments') }}
                        </h3>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                            Ver torneos en curso.
                        </p>
                    </div>

                    <div @click="showCreateTeamModal = true"
                        class="group bg-surface-light dark:bg-surface-dark rounded-3xl p-6 cursor-pointer border border-border-light dark:border-border-dark hover:border-purple-500/50 hover:shadow-lg transition-all duration-300 animate-slide-up stagger-3 relative overflow-hidden">
                        <div
                            class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <span class="material-symbols-outlined text-8xl text-purple-500">group_add</span>
                        </div>
                        <div
                            class="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span
                                class="material-symbols-outlined text-purple-600 dark:text-purple-500 text-3xl">group_add</span>
                        </div>
                        <h3
                            class="text-xl font-bold text-text-primary-light dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                            {{ $t('dashboard.user.create_team') }}
                        </h3>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                            Registra tu equipo ahora.
                        </p>
                    </div>
                </div>

                <!-- 5. Upcoming Matches (Universal) -->
                <div v-if="upcomingMatches?.length"
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-slide-up">
                    <h2
                        class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight">
                        {{ $t('dashboard.upcoming_matches') }}
                    </h2>
                    <div class="space-y-4">
                        <MatchCard v-for="match in upcomingMatches.slice(0, 5)" :key="match.id" :match="match" />
                    </div>
                </div>

            </div>
            <template #fallback>
                <div class="flex justify-center items-center min-h-[60vh]">
                    <span
                        class="material-symbols-outlined animate-spin text-4xl text-primary-500">progress_activity</span>
                </div>
            </template>
        </ClientOnly>

        <!-- Modals -->
        <CreateLeagueModal v-if="showCreateLeagueModal" @close="showCreateLeagueModal = false"
            @created="handleLeagueCreated" />
        <CreateTeamModal v-if="showCreateTeamModal" @close="showCreateTeamModal = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'
import { useNuxtApp, useAsyncData, navigateTo } from '#app'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import CreateLeagueModal from '@/components/modals/CreateLeagueModal.vue'
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { $api } = useNuxtApp()
const localePath = useLocalePath()
const { t } = useI18n()

const showCreateLeagueModal = ref(false)
const showCreateTeamModal = ref(false)

// Fetch user-specific data
// IMPORTANT: We now fetch this for EVERYONE, not just organics. 
// If it's a regular user, it'll likely return empty, which is fine.
const { data: myLeagues, refresh: refreshMyLeagues } = await useAsyncData('my-leagues', async () => {
    const response = await $api.get('/leagues')
    const allLeagues = response.data.success ? response.data.data : []
    // Filter for where I am the organizer
    return allLeagues.filter((l: any) => l.organizer_id === authStore.user?.id)
}, { watch: [() => authStore.user?.id] })

const { data: myTournaments } = await useAsyncData('my-tournaments', async () => {
    // This logic might need backend update to filter by "Organizer ID" if the endpoint returns ALL tournaments.
    // For now, assuming GET /tournaments returns all public ones, we might need a dedicated endpoint or filter client-side if the list is small.
    // Optimization: Filter strictly client side for now as we don't have "My Tournaments" endpoint yet.
    const response = await $api.get('/tournaments')
    return response.data.success ? response.data.data.filter((t: any) => true) : [] // Showing all for now or filter logic similar to leagues
})

const { data: upcomingMatches } = await useAsyncData('upcoming-matches', async () => {
    const response = await $api.get('/matches?status=scheduled')
    return response.data.success ? response.data.data : []
})

const stats = computed(() => ({
    activeLeagues: myLeagues.value?.length || 0,
    activeTournaments: myTournaments.value?.filter((t: any) => t.status === 'in_progress').length || 0,
    todayMatches: upcomingMatches.value?.filter((m: any) => new Date(m.match_date).toDateString() === new Date().toDateString()).length || 0,
}))

const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
        'admin': 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
        'organizer': 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
        'user': 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
    }
    return classes[role] || classes.user
}

const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
        'admin': 'shield',
        'organizer': 'emoji_events',
        'user': 'person'
    }
    return icons[role] || 'person'
}

const getRoleText = (role: string) => {
    return t(`roles.${role}`) || t('roles.user')
}

const handleLeagueCreated = () => {
    showCreateLeagueModal.value = false
    refreshMyLeagues()
}

onMounted(() => {
    favoritesStore.fetchFavorites()
});

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
