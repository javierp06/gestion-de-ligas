<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark pb-12">
        <!-- Loading State -->
        <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="animate-pulse space-y-8">
                <div class="h-64 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 h-96 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
                    <div class="h-96 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
                </div>
            </div>
        </div>

        <div v-else-if="tournament" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Card -->
            <div
                class="relative bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden mb-8 animate-fade-in">
                <!-- Cover Image / Pattern -->
                <div class="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                    <!-- Abstract Pattern -->
                    <div class="absolute inset-0 opacity-20"
                        style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;">
                    </div>

                    <!-- Back Button (Top Left) -->
                    <div class="absolute top-4 left-4 z-10">
                        <button @click="navigateTo(`/leagues/${tournament.league_id}`)"
                            class="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors text-white flex items-center gap-2 pr-4">
                            <span class="material-symbols-outlined">arrow_back</span>
                            <span class="text-sm font-bold">Volver a la Liga</span>
                        </button>
                    </div>

                    <!-- Edit/Delete Actions (Top Right) -->
                    <div v-if="canManage" class="absolute top-4 right-4 flex gap-2">
                        <button @click="showCreateMatchModal = true"
                            class="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors text-white">
                            <span class="material-symbols-outlined">add_circle</span>
                        </button>
                    </div>
                </div>

                <!-- Profile Info -->
                <div class="px-8 pb-8">
                    <div class="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                        <!-- Icon/Logo -->
                        <div
                            class="w-32 h-32 rounded-2xl bg-surface-light dark:bg-surface-dark p-1 shadow-2xl flex items-center justify-center">
                            <div
                                class="w-full h-full rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                                <span class="material-symbols-outlined text-6xl drop-shadow-md">emoji_events</span>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 pt-2 md:pt-0">
                            <div class="flex flex-wrap items-center gap-3 mb-2">
                                <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white">
                                    {{ tournament.name }}
                                </h1>
                                <span :class="getStatusColor(tournament.status)"
                                    class="px-3 py-1 rounded-full text-xs font-bold border border-current/20">
                                    {{ getStatusText(tournament.status) }}
                                </span>
                            </div>

                            <div
                                class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                <span class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-primary-500">trophy</span>
                                    {{ formatType(tournament.format) }}
                                </span>
                                <span v-if="tournament.league_name" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-primary-500">stadium</span>
                                    {{ tournament.league_name }}
                                </span>
                                <span v-if="tournament.start_date" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-primary-500">event</span>
                                    {{ formatDate(tournament.start_date) }}
                                </span>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div
                            class="hidden md:flex gap-8 px-6 py-3 bg-background-light dark:bg-surface-dark-alt rounded-2xl border border-border-light dark:border-border-dark">
                            <div class="text-center">
                                <div class="text-2xl font-black text-text-primary-light dark:text-white">
                                    {{ matches?.length || 0 }}
                                </div>
                                <div
                                    class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Partidos</div>
                            </div>
                            <div class="w-px bg-border-light dark:border-border-dark"></div>
                            <div class="text-center">
                                <div class="text-2xl font-black text-text-primary-light dark:text-white">
                                    {{ teams?.length || 0 }}
                                </div>
                                <div
                                    class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Equipos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Navigation/Tabs -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Custom Tabs -->
                    <div
                        class="flex items-center gap-2 p-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark w-fit overflow-x-auto max-w-full">
                        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                            class="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2"
                            :class="activeTab === tab.value
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'">
                            <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="animate-slide-up">

                        <!-- Matches Tab -->
                        <div v-if="activeTab === 'matches'" class="space-y-8">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Calendario de
                                    Partidos</h3>
                                <div v-if="canManage" class="flex gap-2">
                                    <button @click="showGenerateFixtureModal = true"
                                        class="btn-secondary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        <span class="material-symbols-outlined text-lg">calendar_month</span>
                                        Generar Calendario
                                    </button>
                                    <button @click="showCreateMatchModal = true"
                                        class="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                        <span class="material-symbols-outlined text-lg">add</span>
                                        Nuevo Partido
                                    </button>
                                </div>
                            </div>

                            <div v-if="matches?.length" class="space-y-8">
                                <div v-for="(roundMatches, round) in matchesByRound" :key="round" class="space-y-4">
                                    <div class="flex items-center gap-4">
                                        <h4
                                            class="text-lg font-bold text-text-primary-light dark:text-white flex items-center gap-2">
                                            <span
                                                class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                                                <span class="material-symbols-outlined text-sm">flag</span>
                                            </span>
                                            Jornada {{ round }}
                                        </h4>
                                        <div class="h-px flex-1 bg-border-light dark:border-border-dark"></div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="match in roundMatches" :key="match.id" class="relative group">
                                            <MatchCard :match="match" @click="navigateTo(`/matches/${match.id}`)" />

                                            <!-- Quick Edit Button -->
                                            <button v-if="canManage && match.status !== 'finished'"
                                                @click.stop="openScoreModal(match)"
                                                class="absolute top-2 right-2 p-2 bg-surface-light dark:bg-surface-dark rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-primary-500 hover:text-primary-600 hover:scale-110 transform duration-200">
                                                <span class="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else
                                class="bg-surface-light dark:bg-surface-dark rounded-3xl p-12 text-center border border-border-light dark:border-border-dark border-dashed">
                                <div
                                    class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span
                                        class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">calendar_today</span>
                                </div>
                                <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-2">Sin Partidos
                                </h3>
                                <p
                                    class="text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-xs mx-auto">
                                    No hay partidos programados para este torneo.
                                </p>
                                <div v-if="canManage" class="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button @click="showGenerateFixtureModal = true"
                                        class="text-primary-500 font-bold hover:underline">
                                        Generar Automáticamente
                                    </button>
                                    <span class="text-gray-300 dark:text-gray-600">|</span>
                                    <button @click="showCreateMatchModal = true"
                                        class="text-primary-500 font-bold hover:underline">
                                        Crear Manualmente
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Standings Tab -->
                        <div v-if="activeTab === 'standings'" class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Tabla de
                                    Posiciones</h3>
                                <button v-if="canManage && !standings?.length" @click="initializeStandings"
                                    class="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                    :disabled="initializingStandings">
                                    <span v-if="initializingStandings"
                                        class="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span v-else class="material-symbols-outlined">refresh</span>
                                    Inicializar Tabla
                                </button>
                            </div>

                            <div v-if="standings?.length"
                                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
                                <StandingsTable :standings="standings" />
                            </div>

                            <div v-else
                                class="bg-surface-light dark:bg-surface-dark rounded-3xl p-12 text-center border border-border-light dark:border-border-dark border-dashed">
                                <div
                                    class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span
                                        class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">leaderboard</span>
                                </div>
                                <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-2">Tabla no
                                    Disponible</h3>
                                <p
                                    class="text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-xs mx-auto">
                                    La tabla de posiciones aún no ha sido generada.
                                </p>
                                <button v-if="canManage" @click="initializeStandings"
                                    class="text-primary-500 font-bold hover:underline">
                                    Generar Tabla
                                </button>
                            </div>
                        </div>

                        <!-- Stats Tab -->
                        <div v-if="activeTab === 'stats'" class="space-y-8">
                            <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Estadísticas del
                                Torneo</h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <!-- Top Scorers -->
                                <StatsTable title="Goleadores" icon="sports_soccer" :data="stats?.scorers || []"
                                    statLabel="Goles" statKey="total_goals" />

                                <!-- Top Assists -->
                                <StatsTable title="Asistencias" icon="handshake" :data="stats?.assists || []"
                                    statLabel="Asistencias" statKey="total_assists" />

                                <!-- Cards -->
                                <StatsTable title="Tarjetas" icon="style" :data="stats?.cards || []"
                                    statLabel="Rojas/Amarillas" statKey="yellow_cards" />
                            </div>
                        </div>

                        <!-- Teams Tab -->
                        <div v-if="activeTab === 'teams'" class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Equipos
                                    Participantes</h3>
                                <button v-if="canManage" @click="showAddTeamModal = true"
                                    class="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <span class="material-symbols-outlined">group_add</span>
                                    Gestionar Equipos
                                </button>
                            </div>

                            <div v-if="teams?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TeamCard v-for="team in teams" :key="team.id" :team="team" />
                            </div>

                            <div v-else
                                class="bg-surface-light dark:bg-surface-dark rounded-3xl p-12 text-center border border-border-light dark:border-border-dark border-dashed">
                                <div
                                    class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span
                                        class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">groups</span>
                                </div>
                                <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-2">Sin Equipos
                                </h3>
                                <p
                                    class="text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-xs mx-auto">
                                    No hay equipos inscritos en este torneo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Info/Sidebar -->
                <div class="space-y-6">
                    <!-- About Card -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-6">
                        <h3
                            class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary-500">info</span>
                            Detalles
                        </h3>
                        <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed mb-6">
                            {{ tournament.description || 'Sin descripción disponible.' }}
                        </p>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Formato</span>
                                <span
                                    class="font-bold text-text-primary-light dark:text-white">{{ formatType(tournament.format) }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Equipos</span>
                                <span class="font-bold text-text-primary-light dark:text-white">{{ teams?.length || 0 }}
                                    / {{ tournament.max_teams || '∞' }}</span>
                            </div>
                            <div v-if="tournament.start_date" class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Inicio</span>
                                <span
                                    class="font-bold text-text-primary-light dark:text-white">{{ formatDate(tournament.start_date) }}</span>
                            </div>
                            <div v-if="tournament.end_date" class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Fin</span>
                                <span
                                    class="font-bold text-text-primary-light dark:text-white">{{ formatDate(tournament.end_date) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <UpdateScoreModal v-if="showScoreModal && selectedMatch" :match="selectedMatch" @close="showScoreModal = false"
            @updated="handleScoreUpdated" />
        <GenerateFixtureModal v-if="showGenerateFixtureModal" :tournamentId="parseInt(route.params.id as string)"
            @close="showGenerateFixtureModal = false" @created="handleFixtureCreated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UpdateScoreModal from '@/components/modals/UpdateScoreModal.vue'
import GenerateFixtureModal from '@/components/modals/GenerateFixtureModal.vue'
import StatsTable from '@/components/StatsTable.vue'

const route = useRoute()
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const { getStatusColor, getStatusText } = useSports()

const activeTab = ref('matches')
const showScoreModal = ref(false)
const showCreateMatchModal = ref(false)
const showGenerateFixtureModal = ref(false)
const showAddTeamModal = ref(false)
const selectedMatch = ref<any>(null)
const initializingStandings = ref(false)

const tabs = [
    { value: 'matches', label: 'Partidos', icon: 'sports_soccer' },
    { value: 'standings', label: 'Tabla', icon: 'leaderboard' },
    { value: 'stats', label: 'Estadísticas', icon: 'bar_chart' },
    { value: 'teams', label: 'Equipos', icon: 'group' },
    { value: 'info', label: 'Información', icon: 'info' }
]


const { data: tournament, pending } = await useAsyncData(`tournament-${route.params.id}`, async () => {
    const response = await $api.get(`/tournaments/${route.params.id}`)
    return response.data.success ? response.data.data : null
})


const { data: matches, refresh: refreshMatches } = await useAsyncData(`matches-${route.params.id}`, async () => {
    const response = await $api.get(`/matches?tournament_id=${route.params.id}`)
    return response.data.success ? response.data.data : []
})


const { data: standings, refresh: refreshStandings } = await useAsyncData(`standings-${route.params.id}`, async () => {
    const response = await $api.get(`/standings?tournament_id=${route.params.id}`)
    return response.data.success ? response.data.data.standings : []
})

const { data: stats } = await useAsyncData(`stats-${route.params.id}`, async () => {
    const [scorersRes, assistsRes, cardsRes] = await Promise.all([
        $api.get(`/stats/scorers?tournament_id=${route.params.id}&limit=5`),
        $api.get(`/stats/assists?tournament_id=${route.params.id}&limit=5`),
        $api.get(`/stats/cards?tournament_id=${route.params.id}&limit=5`)
    ])
    return {
        scorers: scorersRes.data.success ? scorersRes.data.data : [],
        assists: assistsRes.data.success ? assistsRes.data.data : [],
        cards: cardsRes.data.success ? cardsRes.data.data : []
    }
})


const { data: teams } = await useAsyncData(`tournament-teams-${route.params.id}`, async () => {
    if (!tournament.value?.league_id) return []
    const response = await $api.get(`/teams?league_id=${tournament.value.league_id}`)
    return response.data.success ? response.data.data : []
})


const canManage = computed(() => {
    if (!authStore.user || !tournament.value) return false
    return authStore.user.id === tournament.value.league_organizer_id || authStore.isAdmin
})

const matchesByRound = computed(() => {
    if (!matches.value) return {}
    const grouped: Record<number, any[]> = {}
    matches.value.forEach((match: any) => {
        const round = match.round || 1
        if (!grouped[round]) grouped[round] = []
        grouped[round].push(match)
    })
    return grouped
})


const formatType = (format: string) => {
    const formats: Record<string, string> = {
        'league': 'Liga (todos contra todos)',
        'knockout': 'Eliminación Directa',
        'group_knockout': 'Grupos + Eliminación'
    }
    return formats[format] || format
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const openScoreModal = (match: any) => {
    selectedMatch.value = match
    showScoreModal.value = true
}

const handleScoreUpdated = () => {
    showScoreModal.value = false
    refreshMatches()
    refreshStandings()
}

const handleFixtureCreated = () => {
    showGenerateFixtureModal.value = false
    refreshMatches()
}

const initializeStandings = async () => {
    if (!tournament.value) return
    initializingStandings.value = true

    try {
        await $api.post(`/standings/initialize/${tournament.value.id}`)
        await refreshStandings()
    } catch (error) {
        console.error('Error initializing standings:', error)
    } finally {
        initializingStandings.value = false
    }
}

definePageMeta({
    layout: 'default'
})
</script>
