<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

        <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="animate-pulse">
                <div class="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
                <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        </div>


        <div v-else-if="tournament">

            <div class="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center gap-3 mb-3">
                                <span class="material-symbols-outlined text-5xl">emoji_events</span>
                                <div>
                                    <h1 class="text-4xl font-bold">{{ tournament.name }}</h1>
                                    <p class="text-blue-100 mt-1">{{ tournament.league?.name }}</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 mt-4 text-sm flex-wrap">
                                <span :class="getStatusColor(tournament.status)"
                                    class="px-3 py-1 rounded-full font-medium">
                                    {{ getStatusText(tournament.status) }}
                                </span>
                                <span
                                    class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-medium">
                                    {{ formatType(tournament.format) }}
                                </span>
                                <span v-if="tournament.start_date" class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-sm">event</span>
                                    {{ formatDate(tournament.start_date) }}
                                </span>
                                <span v-if="tournament.max_teams" class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-sm">group</span>
                                    Máx. {{ tournament.max_teams }} equipos
                                </span>
                            </div>
                        </div>


                        <div v-if="canManage" class="flex gap-2">
                            <button @click="showCreateMatchModal = true"
                                class="btn-primary bg-white text-primary hover:bg-gray-100 flex items-center gap-2">
                                <span class="material-symbols-outlined">add_circle</span>
                                <span class="hidden sm:inline">Crear Partido</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex gap-8 overflow-x-auto">
                        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                            class="py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap"
                            :class="activeTab === tab.value
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm">{{ tab.icon }}</span>
                                {{ tab.label }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>


            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div v-if="activeTab === 'matches'">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold dark:text-white">Partidos</h2>
                        <button v-if="canManage" @click="showCreateMatchModal = true"
                            class="btn-primary flex items-center gap-2">
                            <span class="material-symbols-outlined">add_circle</span>
                            Crear Partido
                        </button>
                    </div>


                    <div v-if="matches?.length" class="space-y-8">
                        <div v-for="(roundMatches, round) in matchesByRound" :key="round" class="space-y-4">
                            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <span class="material-symbols-outlined">flag</span>
                                Jornada {{ round }}
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="match in roundMatches" :key="match.id" class="relative">
                                    <MatchCard :match="match" @click="navigateTo(`/matches/${match.id}`)" />
                                    <button v-if="canManage && match.status !== 'finished'"
                                        @click.stop="openScoreModal(match)"
                                        class="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                        <span class="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-16">
                        <span class="material-symbols-outlined text-gray-300 dark:text-gray-600"
                            style="font-size: 80px">sports_soccer</span>
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">No hay partidos
                            programados</h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Crea el primer partido del torneo</p>
                    </div>
                </div>


                <div v-if="activeTab === 'standings'">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold dark:text-white">Tabla de Posiciones</h2>
                        <button v-if="canManage && !standings?.length" @click="initializeStandings"
                            class="btn-primary flex items-center gap-2" :disabled="initializingStandings">
                            <span v-if="initializingStandings"
                                class="material-symbols-outlined animate-spin">progress_activity</span>
                            <span v-else class="material-symbols-outlined">add_circle</span>
                            Inicializar Tabla
                        </button>
                    </div>

                    <div v-if="standings?.length">
                        <StandingsTable :standings="standings" />
                    </div>
                    <div v-else class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
                        <span class="material-symbols-outlined text-gray-300 dark:text-gray-600"
                            style="font-size: 80px">leaderboard</span>
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">Tabla no inicializada
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Inicializa la tabla para empezar a registrar
                            resultados</p>
                    </div>
                </div>


                <div v-if="activeTab === 'teams'">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold dark:text-white">Equipos Participantes</h2>
                        <button v-if="canManage" @click="showAddTeamModal = true"
                            class="btn-primary flex items-center gap-2">
                            <span class="material-symbols-outlined">add_circle</span>
                            Añadir Equipo
                        </button>
                    </div>

                    <div v-if="teams?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TeamCard v-for="team in teams" :key="team.id" :team="team" />
                    </div>
                    <div v-else class="text-center py-16">
                        <span class="material-symbols-outlined text-gray-300 dark:text-gray-600"
                            style="font-size: 80px">group</span>
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">No hay equipos inscritos
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Añade equipos para comenzar el torneo</p>
                    </div>
                </div>


                <div v-if="activeTab === 'info'">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 class="text-2xl font-bold mb-4 dark:text-white">Información del Torneo</h2>

                        <div v-if="tournament.description" class="prose dark:prose-invert max-w-none mb-6">
                            <p>{{ tournament.description }}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">trophy</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Formato</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ formatType(tournament.format) }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">emoji_events</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Liga</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ tournament.league?.name }}</p>
                                </div>
                            </div>

                            <div v-if="tournament.start_date" class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">event</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Fecha de inicio</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ formatDate(tournament.start_date) }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="tournament.end_date" class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">event</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Fecha de fin</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ formatDate(tournament.end_date) }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="tournament.max_teams" class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">group</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Equipos</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ teams?.length || 0 }} /
                                        {{ tournament.max_teams }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-primary">calendar_today</span>
                                <div>
                                    <p class="font-semibold dark:text-white">Creado</p>
                                    <p class="text-gray-600 dark:text-gray-400">{{ formatDate(tournament.created_at) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <UpdateScoreModal v-if="showScoreModal && selectedMatch" :match="selectedMatch" @close="showScoreModal = false"
            @updated="handleScoreUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const { getStatusColor, getStatusText } = useSports()

const activeTab = ref('matches')
const showScoreModal = ref(false)
const showCreateMatchModal = ref(false)
const showAddTeamModal = ref(false)
const selectedMatch = ref<any>(null)
const initializingStandings = ref(false)

const tabs = [
    { value: 'matches', label: 'Partidos', icon: 'sports_soccer' },
    { value: 'standings', label: 'Tabla', icon: 'leaderboard' },
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
    return response.data.success ? response.data.data : []
})


const { data: teams } = await useAsyncData(`tournament-teams-${route.params.id}`, async () => {
    if (!tournament.value?.league_id) return []
    const response = await $api.get(`/teams?league_id=${tournament.value.league_id}`)
    return response.data.success ? response.data.data : []
})


const canManage = computed(() => {
    if (!authStore.user || !tournament.value?.league) return false
    return authStore.user.id === tournament.value.league.organizer_id || authStore.isAdmin
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
