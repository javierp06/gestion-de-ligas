<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark pb-12">
        <!-- Hero Header -->
        <div
            class="relative bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10 dark:opacity-20">
                <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
                <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Navigation & Actions -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div
                        class="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark animate-fade-in">
                        <NuxtLink :to="localePath('/matches')" class="hover:text-primary-500 transition-colors">
                            {{ $t('nav.matches') }}
                        </NuxtLink>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                        <span
                            class="text-text-primary-light dark:text-white font-medium">{{ $t('match_details.title') }}</span>
                    </div>

                    <div v-if="canManage" class="flex gap-2 animate-fade-in">
                        <button @click="openManageStats"
                            class="btn-secondary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined">leaderboard</span>
                            {{ $t('match_details.manage_stats') }}
                        </button>
                        <button @click="openEditModal"
                            class="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined">edit</span>
                            {{ $t('match_details.edit_match') }}
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-center py-12">
                    <span
                        class="material-symbols-outlined animate-spin text-4xl text-primary-500">progress_activity</span>
                </div>

                <div v-else-if="match" class="animate-slide-up">
                    <!-- Tournament Info -->
                    <div class="text-center mb-8">
                        <span
                            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">
                            <span class="material-symbols-outlined text-lg">emoji_events</span>
                            {{ match.league_name }} - {{ match.tournament_name }}
                        </span>
                    </div>

                    <!-- Scoreboard -->
                    <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <!-- Home Team -->
                        <NuxtLink :to="localePath(`/teams/${match.home_team_id}`)"
                            class="flex flex-col items-center gap-4 flex-1 text-center group/team">
                            <div class="relative">
                                <div
                                    class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-4 shadow-lg flex items-center justify-center transform group-hover/team:scale-110 transition-transform duration-300">
                                    <img v-if="match.home_team_logo" :src="match.home_team_logo"
                                        :alt="match.home_team_name" class="w-full h-full object-contain">
                                    <span v-else class="material-symbols-outlined text-4xl text-gray-400">groups</span>
                                </div>
                                <div v-if="match.home_score > match.away_score"
                                    class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <span class="material-symbols-outlined text-white text-sm">emoji_events</span>
                                </div>
                            </div>
                            <div>
                                <h2
                                    class="text-xl md:text-2xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight group-hover/team:text-primary-500 transition-colors">
                                    {{ match.home_team_name }}
                                </h2>
                                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                    {{ $t('match_details.local') }}
                                </p>
                            </div>
                        </NuxtLink>

                        <!-- Score -->
                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="flex items-center gap-4 bg-surface-light dark:bg-surface-dark-alt px-8 py-4 rounded-2xl border border-border-light dark:border-border-dark shadow-neon">
                                <span
                                    class="text-4xl md:text-6xl font-display font-black text-text-primary-light dark:text-white">
                                    {{ match.home_score ?? '-' }}
                                </span>
                                <span
                                    class="text-2xl text-text-secondary-light dark:text-text-secondary-dark font-bold">:</span>
                                <span
                                    class="text-4xl md:text-6xl font-display font-black text-text-primary-light dark:text-white">
                                    {{ match.away_score ?? '-' }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 px-3 py-1 rounded-lg"
                                :class="getStatusClass(match.status)">
                                <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                <span
                                    class="text-xs font-bold uppercase tracking-wider">{{ getStatusText(match.status) }}</span>
                            </div>
                        </div>

                        <!-- Away Team -->
                        <NuxtLink :to="localePath(`/teams/${match.away_team_id}`)"
                            class="flex flex-col items-center gap-4 flex-1 text-center group/team">
                            <div class="relative">
                                <div
                                    class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-4 shadow-lg flex items-center justify-center transform group-hover/team:scale-110 transition-transform duration-300">
                                    <img v-if="match.away_team_logo" :src="match.away_team_logo"
                                        :alt="match.away_team_name" class="w-full h-full object-contain">
                                    <span v-else class="material-symbols-outlined text-4xl text-gray-400">groups</span>
                                </div>
                                <div v-if="match.away_score > match.home_score"
                                    class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <span class="material-symbols-outlined text-white text-sm">emoji_events</span>
                                </div>
                            </div>
                            <div>
                                <h2
                                    class="text-xl md:text-2xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight group-hover/team:text-primary-500 transition-colors">
                                    {{ match.away_team_name }}
                                </h2>
                                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                    {{ $t('match_details.visitor') }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Match Info -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
                        <div
                            class="flex flex-col items-center gap-1 p-4 rounded-xl bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                            <span class="material-symbols-outlined text-primary-500">calendar_today</span>
                            <span
                                class="text-sm font-bold text-text-primary-light dark:text-white">{{ formatDate(match.match_date) }}</span>
                            <span
                                class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ $t('match_details.date') }}</span>
                        </div>
                        <div
                            class="flex flex-col items-center gap-1 p-4 rounded-xl bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                            <span class="material-symbols-outlined text-primary-500">schedule</span>
                            <span
                                class="text-sm font-bold text-text-primary-light dark:text-white">{{ formatTime(match.match_date) }}</span>
                            <span
                                class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ $t('match_details.time') }}</span>
                        </div>
                        <div
                            class="flex flex-col items-center gap-1 p-4 rounded-xl bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                            <span class="material-symbols-outlined text-primary-500">stadium</span>
                            <span
                                class="text-sm font-bold text-text-primary-light dark:text-white truncate w-full text-center">{{ match.location || $t('match_details.tbd') }}</span>
                            <span
                                class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ $t('match_details.stadium') }}</span>
                        </div>
                        <div
                            class="flex flex-col items-center gap-1 p-4 rounded-xl bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                            <span class="material-symbols-outlined text-primary-500">sports</span>
                            <span
                                class="text-sm font-bold text-text-primary-light dark:text-white truncate w-full text-center">{{ match.referee || $t('match_details.to_be_assigned') }}</span>
                            <span
                                class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ $t('match_details.referee') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Tabs -->
        <div v-if="match" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex gap-4 border-b border-border-light dark:border-border-dark mb-8 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 whitespace-nowrap"
                    :class="activeTab === tab.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Summary Tab -->
            <div v-if="activeTab === 'summary'" class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <!-- Match Events -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">timeline</span>
                        {{ $t('match_details.match_events') }}
                    </h3>

                    <div v-if="matchEvents.length > 0" class="space-y-4">
                        <div v-for="(event, index) in matchEvents" :key="index" class="flex items-center gap-4">
                            <div class="w-12 text-right font-mono font-bold text-primary-500">{{ event.minute }}'</div>
                            <div
                                class="w-8 h-8 rounded-full bg-background-light dark:bg-white/5 flex items-center justify-center border border-border-light dark:border-border-dark">
                                <span class="material-symbols-outlined text-sm"
                                    :class="getEventColor(event.type)">{{ getEventIcon(event.type) }}</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                    {{ event.player_name }}
                                </p>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    {{ getEventText(event.type) }}
                                </p>
                            </div>
                            <div
                                class="text-xs font-bold px-2 py-1 rounded bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                                {{ event.team_name }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">timer_off</span>
                        <p>{{ $t('match_details.no_events') }}</p>
                    </div>
                </div>

                <!-- Match Stats -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">analytics</span>
                        {{ $t('match_details.manage_stats') }}
                    </h3>

                    <div class="space-y-6">
                        <div v-for="(stat, index) in teamStats" :key="index" class="space-y-2">
                            <div class="flex justify-between text-sm font-bold text-text-primary-light dark:text-white">
                                <span>{{ stat.homeValue }}</span>
                                <span>{{ stat.label }}</span>
                                <span>{{ stat.awayValue }}</span>
                            </div>
                            <div class="flex h-2 rounded-full overflow-hidden bg-background-light dark:bg-white/5">
                                <div class="bg-primary-500"
                                    :style="{ width: getStatPercentage(stat.homeValue, stat.awayValue) + '%' }"></div>
                                <div class="bg-blue-500"
                                    :style="{ width: getStatPercentage(stat.awayValue, stat.homeValue) + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lineups Tab -->
            <div v-else-if="activeTab === 'lineups'" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <!-- Home Team Lineup -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border-light dark:border-border-dark">
                        <img v-if="match.home_team_logo" :src="match.home_team_logo" class="w-8 h-8 object-contain">
                        <h3 class="text-lg font-bold text-text-primary-light dark:text-white">{{ match.home_team_name }}
                        </h3>
                    </div>
                    <div class="space-y-3">
                        <div v-for="player in homePlayers" :key="player.id"
                            class="flex items-center justify-between p-3 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                                    {{ player.jersey_number || '#' }}
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                        {{ player.player_name }}
                                    </p>
                                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                        {{ player.position || $t('match_details.player') }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-1">
                                <span v-if="player.goals > 0" class="material-symbols-outlined text-sm text-green-500"
                                    title="Gol">sports_soccer</span>
                                <span v-if="player.yellow_cards > 0"
                                    class="material-symbols-outlined text-sm text-yellow-500"
                                    title="Tarjeta Amarilla">style</span>
                                <span v-if="player.red_cards > 0" class="material-symbols-outlined text-sm text-red-500"
                                    title="Tarjeta Roja">style</span>
                            </div>
                        </div>
                        <div v-if="homePlayers.length === 0"
                            class="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                            {{ $t('match_details.no_lineup') }}
                        </div>
                    </div>
                </div>

                <!-- Away Team Lineup -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border-light dark:border-border-dark">
                        <img v-if="match.away_team_logo" :src="match.away_team_logo" class="w-8 h-8 object-contain">
                        <h3 class="text-lg font-bold text-text-primary-light dark:text-white">{{ match.away_team_name }}
                        </h3>
                    </div>
                    <div class="space-y-3">
                        <div v-for="player in awayPlayers" :key="player.id"
                            class="flex items-center justify-between p-3 rounded-xl hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {{ player.jersey_number || '#' }}
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                        {{ player.player_name }}
                                    </p>
                                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                        {{ player.position || $t('match_details.player') }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex gap-1">
                                <span v-if="player.goals > 0" class="material-symbols-outlined text-sm text-green-500"
                                    title="Gol">sports_soccer</span>
                                <span v-if="player.yellow_cards > 0"
                                    class="material-symbols-outlined text-sm text-yellow-500"
                                    title="Tarjeta Amarilla">style</span>
                                <span v-if="player.red_cards > 0" class="material-symbols-outlined text-sm text-red-500"
                                    title="Tarjeta Roja">style</span>
                            </div>
                        </div>
                        <div v-if="awayPlayers.length === 0"
                            class="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                            {{ $t('match_details.no_lineup') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modals -->
        <UpdateScoreModal v-if="showEditModal && match" :match="match" @close="showEditModal = false"
            @updated="fetchMatchDetails" />

        <UpdateMatchStatsModal v-if="showStatsModal && match" :match="match" @close="showStatsModal = false"
            @updated="fetchMatchDetails" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '@/stores/auth'
import UpdateScoreModal from '@/components/modals/UpdateScoreModal.vue'
import UpdateMatchStatsModal from '@/components/modals/UpdateMatchStatsModal.vue'

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const localePath = useLocalePath()
const { locale } = useI18n()

const match = ref<any>(null)
const loading = ref(true)
const activeTab = ref('summary')
const showEditModal = ref(false)
const showStatsModal = ref(false)

const tabs = computed(() => [
    { id: 'summary', label: t('match_details.tabs.summary') },
    { id: 'lineups', label: t('match_details.tabs.lineups') },
    { id: 'stats', label: t('match_details.tabs.stats') }
])

const canManage = computed(() => {
    return authStore.isAdmin || authStore.isOrganizer
})

const openEditModal = () => {
    showEditModal.value = true
}

const openManageStats = () => {
    showStatsModal.value = true
}

const fetchMatchDetails = async () => {
    loading.value = true
    try {
        const response = await $api.get(`/matches/${route.params.id}`)
        if (response.data.success) {
            match.value = response.data.data
        }
    } catch (error) {
        console.error('Error fetching match details:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMatchDetails()
})

const homePlayers = computed(() => {
    if (!match.value?.player_stats) return []
    return match.value.player_stats.filter((p: any) => p.team_name === match.value.home_team_name)
})

const awayPlayers = computed(() => {
    if (!match.value?.player_stats) return []
    return match.value.player_stats.filter((p: any) => p.team_name === match.value.away_team_name)
})

const matchEvents = computed(() => {
    if (!match.value?.player_stats) return []
    const events: any[] = []

    match.value.player_stats.forEach((p: any) => {
        // Goals
        for (let i = 0; i < p.goals; i++) {
            events.push({
                minute: Math.floor(Math.random() * 90) + 1, // Mock minute since we don't store it yet
                type: 'goal',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
        // Yellow Cards
        for (let i = 0; i < p.yellow_cards; i++) {
            events.push({
                minute: Math.floor(Math.random() * 90) + 1,
                type: 'yellow_card',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
        // Red Cards
        for (let i = 0; i < p.red_cards; i++) {
            events.push({
                minute: Math.floor(Math.random() * 90) + 1,
                type: 'red_card',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
    })

    return events.sort((a, b) => a.minute - b.minute)
})

const teamStats = computed(() => {
    if (!match.value?.player_stats) return []

    const homeStats = match.value.player_stats.filter((p: any) => p.team_name === match.value.home_team_name)
    const awayStats = match.value.player_stats.filter((p: any) => p.team_name === match.value.away_team_name)

    const sum = (arr: any[], key: string) => arr.reduce((acc, curr) => acc + (curr[key] || 0), 0)

    return [
        { label: t('match_details.stats.goals'), homeValue: match.value.home_score || 0, awayValue: match.value.away_score || 0 },
        { label: t('match_details.stats.yellow_cards'), homeValue: sum(homeStats, 'yellow_cards'), awayValue: sum(awayStats, 'yellow_cards') },
        { label: t('match_details.stats.red_cards'), homeValue: sum(homeStats, 'red_cards'), awayValue: sum(awayStats, 'red_cards') },
        { label: t('match_details.stats.assists'), homeValue: sum(homeStats, 'assists'), awayValue: sum(awayStats, 'assists') }
    ]
})

const getStatPercentage = (val1: number, val2: number) => {
    const total = val1 + val2
    if (total === 0) return 50
    return (val1 / total) * 100
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale.value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale.value, {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusText = (status: string) => {
    return t(`match_details.status.${status}`)
}

const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
        'scheduled': 'bg-blue-500/10 text-blue-500',
        'live': 'bg-red-500/10 text-red-500',
        'finished': 'bg-green-500/10 text-green-500',
        'postponed': 'bg-orange-500/10 text-orange-500',
        'cancelled': 'bg-gray-500/10 text-gray-500'
    }
    return map[status] || 'bg-gray-500/10 text-gray-500'
}

const getEventIcon = (type: string) => {
    const map: Record<string, string> = {
        'goal': 'sports_soccer',
        'yellow_card': 'style',
        'red_card': 'style'
    }
    return map[type] || 'info'
}

const getEventColor = (type: string) => {
    const map: Record<string, string> = {
        'goal': 'text-green-500',
        'yellow_card': 'text-yellow-500',
        'red_card': 'text-red-500'
    }
    return map[type] || 'text-gray-500'
}

const getEventText = (type: string) => {
    return t(`match_details.events.${type}`)
}

definePageMeta({
    layout: 'default'
})
</script>
