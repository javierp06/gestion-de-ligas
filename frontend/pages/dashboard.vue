<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark">
        <ClientOnly>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Welcome Header -->
                <div class="mb-8 animate-fade-in">
                    <h1
                        class="text-3xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight">
                        {{ $t('dashboard.welcome', { name: authStore.user?.name || 'Usuario' }) }}
                    </h1>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1 font-medium">
                        <span :class="getRoleBadgeClass(authStore.user?.role || 'user')"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border">
                            <span
                                class="material-symbols-outlined text-sm mr-1">{{ getRoleIcon(authStore.user?.role || 'user') }}</span>
                            {{ getRoleText(authStore.user?.role || 'user') }}
                        </span>
                    </p>
                </div>

                <!-- ADMIN Dashboard -->
                <div v-if="authStore.isAdmin">
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="animate-slide-up stagger-1">
                            <StatsCard :title="$t('dashboard.stats.total_users')" :value="stats.totalUsers || 0"
                                icon="group" color="blue" />
                        </div>
                        <div class="animate-slide-up stagger-2">
                            <StatsCard :title="$t('dashboard.stats.active_leagues')" :value="stats.activeLeagues || 0"
                                icon="emoji_events" color="green" />
                        </div>
                        <div class="animate-slide-up stagger-3">
                            <StatsCard :title="$t('dashboard.stats.active_tournaments')"
                                :value="stats.activeTournaments || 0" icon="sports" color="purple" />
                        </div>
                        <div class="animate-slide-up stagger-4">
                            <StatsCard :title="$t('dashboard.stats.today_matches')" :value="stats.todayMatches || 0"
                                icon="today" color="orange" />
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 mb-8 animate-slide-up">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight">
                            {{ $t('dashboard.quick_actions.title') }}
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="animate-scale-in stagger-1">
                                <QuickAction :title="$t('dashboard.quick_actions.manage_users')"
                                    :description="$t('dashboard.quick_actions.manage_users_desc')"
                                    icon="manage_accounts" @click="navigateTo('/admin/users')" />
                            </div>
                            <div class="animate-scale-in stagger-2">
                                <QuickAction :title="$t('dashboard.quick_actions.view_leagues')"
                                    :description="$t('dashboard.quick_actions.view_leagues_desc')" icon="emoji_events"
                                    @click="navigateTo('/leagues')" />
                            </div>
                            <div class="animate-scale-in stagger-3">
                                <QuickAction :title="$t('dashboard.quick_actions.reports')"
                                    :description="$t('dashboard.quick_actions.reports_desc')" icon="analytics"
                                    @click="navigateTo('/admin/reports')" />
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight">
                            {{ $t('dashboard.recent_activity.title') }}
                        </h2>
                        <div class="space-y-4">
                            <div v-for="i in 5" :key="i"
                                class="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark">
                                <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <span class="material-symbols-outlined text-primary-500">person</span>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                        {{ $t('dashboard.recent_activity.user_registered') }}
                                    </p>
                                    <p
                                        class="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                        {{ $t('dashboard.recent_activity.time_ago') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ORGANIZER Dashboard -->
                <div v-else-if="authStore.isOrganizer">
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="animate-slide-up stagger-1">
                            <StatsCard :title="$t('dashboard.organizer.my_leagues')" :value="myLeagues?.length || 0"
                                icon="emoji_events" color="blue" />
                        </div>
                        <div class="animate-slide-up stagger-2">
                            <StatsCard :title="$t('dashboard.organizer.tournaments')"
                                :value="myTournaments?.length || 0" icon="sports" color="green" />
                        </div>
                        <div class="animate-slide-up stagger-3">
                            <StatsCard :title="$t('dashboard.stats.total_teams')" :value="stats.totalTeams || 0"
                                icon="group" color="purple" />
                        </div>
                        <div class="animate-slide-up stagger-4">
                            <StatsCard :title="$t('dashboard.stats.pending_matches')" :value="stats.pendingMatches || 0"
                                icon="schedule" color="orange" />
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 mb-8">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                            <span class="material-symbols-outlined text-primary-500">bolt</span>
                            {{ $t('dashboard.quick_actions.title') }}
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <QuickAction :title="$t('dashboard.quick_actions.create_league')"
                                :description="$t('dashboard.quick_actions.create_league_desc')" icon="add_circle"
                                @click="navigateTo(localePath('/admin/leagues/create'))" />
                            <QuickAction :title="$t('dashboard.quick_actions.manage_tournaments')"
                                :description="$t('dashboard.quick_actions.manage_tournaments_desc')" icon="emoji_events"
                                @click="navigateTo(localePath('/tournaments'))" />
                            <QuickAction :title="$t('dashboard.quick_actions.register_result')"
                                :description="$t('dashboard.quick_actions.register_result_desc')" icon="edit_square"
                                @click="navigateTo(localePath('/matches'))" />
                        </div>
                    </div>

                    <!-- My Leagues -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 mb-8">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight">
                            {{ $t('dashboard.organizer.my_leagues') }}
                        </h2>
                        <div v-if="myLeagues?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LeagueCard v-for="league in myLeagues" :key="league.id" :league="league"
                                @click="navigateTo(`/leagues/${league.id}`)" />
                        </div>
                        <div v-else
                            class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                            <span
                                class="material-symbols-outlined text-6xl mb-4 text-primary-500/50">emoji_events</span>
                            <p class="font-medium text-lg">{{ $t('dashboard.organizer.no_leagues') }}</p>
                            <button @click="navigateTo(localePath('/admin/leagues/create'))"
                                class="btn-primary mt-6 px-8 py-3 rounded-xl font-bold shadow-neon">
                                {{ $t('dashboard.organizer.create_first_league') }}
                            </button>
                        </div>
                    </div>

                    <!-- Upcoming Matches -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 uppercase tracking-tight">
                            {{ $t('dashboard.upcoming_matches') }}
                        </h2>
                        <div v-if="upcomingMatches?.length" class="space-y-4">
                            <MatchCard v-for="match in upcomingMatches.slice(0, 5)" :key="match.id" :match="match" />
                        </div>
                        <div v-else
                            class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                            <span
                                class="material-symbols-outlined text-6xl mb-4 text-primary-500/50">sports_soccer</span>
                            <p class="font-medium text-lg">{{ $t('dashboard.no_matches') }}</p>
                        </div>
                    </div>
                </div>

                <!-- USER Dashboard -->
                <div v-else>
                    <!-- Welcome Message -->
                    <div
                        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-900 p-8 mb-8 animate-scale-in shadow-xl">
                        <!-- Background Pattern -->
                        <div
                            class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2">
                        </div>
                        <div
                            class="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2">
                        </div>

                        <div
                            class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h2 class="text-3xl font-display font-black text-white mb-2 tracking-tight">
                                    {{ $t('dashboard.user.welcome_title') }}
                                </h2>
                                <p class="text-primary-100 text-lg max-w-xl leading-relaxed">
                                    {{ $t('dashboard.user.welcome_subtitle') }}
                                </p>
                            </div>
                            <button @click="navigateTo(localePath('/leagues/create'))"
                                class="group relative px-6 py-3 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                <span
                                    class="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                {{ $t('dashboard.user.create_first_league') }}
                            </button>
                        </div>
                    </div>

                    <!-- Quick Links -->
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
                            <p
                                class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium leading-relaxed">
                                {{ $t('dashboard.user.explore_leagues_desc') }}
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
                            <p
                                class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium leading-relaxed">
                                {{ $t('dashboard.user.view_tournaments_desc') }}
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
                            <p
                                class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium leading-relaxed">
                                {{ $t('dashboard.user.create_team_desc') }}
                            </p>
                        </div>
                    </div>

                    <!-- Recent Leagues -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-slide-up">
                        <div class="flex items-center justify-between mb-6">
                            <h2
                                class="text-2xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary-500">star</span>
                                {{ $t('dashboard.user.featured_leagues') }}
                            </h2>
                            <button @click="navigateTo('/leagues')"
                                class="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
                                Ver todas
                                <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>

                        <div v-if="recentLeagues?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LeagueCard v-for="league in recentLeagues.slice(0, 6)" :key="league.id" :league="league"
                                @click="navigateTo(`/leagues/${league.id}`)" />
                        </div>
                        <div v-else
                            class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                            <span
                                class="material-symbols-outlined text-6xl mb-4 text-primary-500/50">sentiment_dissatisfied</span>
                            <p class="font-medium text-lg">{{ $t('dashboard.user.no_leagues_available') }}</p>
                        </div>
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
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNuxtApp, useAsyncData, navigateTo } from '#app'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#imports'
import CreateLeagueModal from '@/components/modals/CreateLeagueModal.vue'
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'

const authStore = useAuthStore()
const { $api } = useNuxtApp()
const localePath = useLocalePath()

const showCreateLeagueModal = ref(false)
const showCreateTeamModal = ref(false)

// Fetch user-specific data
const { data: myLeagues } = await useAsyncData('my-leagues', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/leagues')
    const allLeagues = response.data.success ? response.data.data : []
    return allLeagues.filter((l: any) => l.organizer_id === authStore.user?.id)
}, { watch: [() => authStore.user?.id] })

const { data: myTournaments } = await useAsyncData('my-tournaments', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/tournaments')
    return response.data.success ? response.data.data : []
})

const { data: recentLeagues } = await useAsyncData('recent-leagues', async () => {
    const response = await $api.get('/leagues?status=active')
    return response.data.success ? response.data.data : []
})

const { data: upcomingMatches } = await useAsyncData('upcoming-matches', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/matches?status=scheduled')
    return response.data.success ? response.data.data : []
})

const stats = computed(() => ({
    totalUsers: 156,
    activeLeagues: recentLeagues.value?.length || 0,
    activeTournaments: myTournaments.value?.filter((t: any) => t.status === 'in_progress').length || 0,
    todayMatches: 8,
    totalTeams: 42,
    pendingMatches: upcomingMatches.value?.length || 0
}))

const { t } = useI18n()

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
    refreshNuxtData('my-leagues')
    refreshNuxtData('recent-leagues')
}

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
