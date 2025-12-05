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

        <div v-else-if="team" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Card -->
            <div
                class="relative bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden mb-8 animate-fade-in">
                <!-- Cover Image / Pattern -->
                <div class="h-48 bg-gradient-to-br from-green-600 to-teal-700 relative">
                    <div class="absolute inset-0 opacity-20"
                        style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;">
                    </div>

                    <!-- Back Button -->
                    <div class="absolute top-4 left-4 z-10">
                        <button @click="navigateTo('/teams')"
                            class="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors text-white flex items-center gap-2 pr-4">
                            <span class="material-symbols-outlined">arrow_back</span>
                            <span class="text-sm font-bold">Volver a Equipos</span>
                        </button>
                    </div>
                </div>

                <!-- Profile Info -->
                <div class="px-8 pb-8">
                    <div class="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                        <!-- Logo -->
                        <div
                            class="w-32 h-32 rounded-2xl bg-surface-light dark:bg-surface-dark p-1 shadow-2xl flex items-center justify-center">
                            <img v-if="team.logo" :src="team.logo" :alt="team.name"
                                class="w-full h-full object-contain rounded-xl bg-white" />
                            <div v-else
                                class="w-full h-full rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400">
                                {{ team.name.charAt(0) }}
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 pt-2 md:pt-0">
                            <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white mb-2">
                                {{ team.name }}
                            </h1>
                            <div
                                class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                <span v-if="team.league_name" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-primary-500">stadium</span>
                                    {{ team.league_name }}
                                </span>
                                <span v-if="team.founded_year" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-primary-500">calendar_month</span>
                                    Fundado en {{ team.founded_year }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Tabs -->
                    <div
                        class="flex items-center gap-2 p-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark w-fit overflow-x-auto max-w-full">
                        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                            class="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2"
                            :class="activeTab === tab.value ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'">
                            <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div class="animate-slide-up">
                        <!-- Squad Tab -->
                        <div v-if="activeTab === 'squad'" class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Plantilla</h3>
                                <button v-if="canManage" @click="showAddPlayerModal = true"
                                    class="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <span class="material-symbols-outlined">person_add</span>
                                    Agregar Jugador
                                </button>
                            </div>

                            <div v-if="players?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="player in players" :key="player.id"
                                    class="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        <img v-if="player.photo" :src="player.photo"
                                            class="w-full h-full object-cover" />
                                        <div v-else
                                            class="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                            {{ player.name.charAt(0) }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold text-text-primary-light dark:text-white">{{ player.name }}
                                        </div>
                                        <div
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2">
                                            <span v-if="player.position"
                                                class="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10">{{ player.position }}</span>
                                            <span v-if="player.jersey_number">#{{ player.jersey_number }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark italic">
                                No hay jugadores registrados.
                            </div>
                        </div>

                        <!-- Matches Tab -->
                        <div v-if="activeTab === 'matches'" class="space-y-6">
                            <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Partidos</h3>
                            <div v-if="matches?.length" class="space-y-4">
                                <MatchCard v-for="match in matches" :key="match.id" :match="match" />
                            </div>
                            <div v-else
                                class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark italic">
                                No hay partidos registrados.
                            </div>
                        </div>

                        <!-- Stats Tab -->
                        <div v-if="activeTab === 'stats'" class="space-y-6">
                            <h3 class="text-xl font-bold text-text-primary-light dark:text-white">Estadísticas del
                                Equipo</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Team Top Scorers -->
                                <StatsTable title="Goleadores" icon="sports_soccer" :data="stats?.scorers || []"
                                    statLabel="Goles" statKey="total_goals" />
                                <!-- Team Top Assists -->
                                <StatsTable title="Asistencias" icon="handshake" :data="stats?.assists || []"
                                    statLabel="Asistencias" statKey="total_assists" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-6">
                        <h3
                            class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary-500">info</span>
                            Detalles
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Entrenador</span>
                                <span
                                    class="font-bold text-text-primary-light dark:text-white">{{ team.coach || 'No asignado' }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-text-secondary-light dark:text-text-secondary-dark">Estadio</span>
                                <span
                                    class="font-bold text-text-primary-light dark:text-white">{{ team.stadium || 'No asignado' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MatchCard from '@/components/MatchCard.vue'
import StatsTable from '@/components/StatsTable.vue'

const route = useRoute()
const authStore = useAuthStore()
const { $api } = useNuxtApp()

const activeTab = ref('squad')
const showAddPlayerModal = ref(false)

const tabs = [
    { value: 'squad', label: 'Plantilla', icon: 'groups' },
    { value: 'matches', label: 'Partidos', icon: 'sports_soccer' },
    { value: 'stats', label: 'Estadísticas', icon: 'bar_chart' },
    { value: 'info', label: 'Información', icon: 'info' }
]

// Fetch Team Details
const { data: team, pending } = await useAsyncData(`team-${route.params.id}`, async () => {
    const response = await $api.get(`/teams/${route.params.id}`)
    return response.data.success ? response.data.data : null
})

// Fetch Players
const { data: players } = await useAsyncData(`team-players-${route.params.id}`, async () => {
    const response = await $api.get(`/players?team_id=${route.params.id}`)
    return response.data.success ? response.data.data : []
})

// Fetch Matches
const { data: matches } = await useAsyncData(`team-matches-${route.params.id}`, async () => {
    const response = await $api.get(`/matches?team_id=${route.params.id}`)
    return response.data.success ? response.data.data : []
})

// Fetch Stats
const { data: stats } = await useAsyncData(`team-stats-${route.params.id}`, async () => {
    const [scorersRes, assistsRes] = await Promise.all([
        $api.get(`/stats/scorers?team_id=${route.params.id}&limit=5`),
        $api.get(`/stats/assists?team_id=${route.params.id}&limit=5`)
    ])
    return {
        scorers: scorersRes.data.success ? scorersRes.data.data : [],
        assists: assistsRes.data.success ? assistsRes.data.data : []
    }
})

const canManage = computed(() => {
    if (!authStore.user || !team.value) return false
    // Logic to check if user manages this team (e.g. is captain or league organizer)
    return authStore.isAdmin // Simplified for now
})

definePageMeta({
    layout: 'default'
})
</script>
