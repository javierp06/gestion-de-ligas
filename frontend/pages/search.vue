<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {{ $t('search.title', { query: route.query.q }) }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
                {{ $t('search.subtitle', { count: totalResults }) }}
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>

        <!-- Results -->
        <div v-else class="space-y-8">
            <!-- Teams -->
            <div v-if="teams.length > 0" class="space-y-4 animate-fade-in-up">
                <h2 class="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <span class="material-symbols-outlined text-primary-500">groups</span>
                    {{ $t('search.teams') }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="team in teams" :key="team.id" :to="localePath(`/teams/${team.id}`)"
                        class="group bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark hover:border-primary-500 transition-all flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 p-2 flex items-center justify-center">
                            <img v-if="team.logo" :src="team.logo" class="w-full h-full object-contain" />
                            <span v-else class="material-symbols-outlined text-gray-400">shield</span>
                        </div>
                        <div>
                            <h3
                                class="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                                {{ team.name }}
                            </h3>
                            <p class="text-xs text-gray-500">{{ team.short_name || team.name }}</p>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <!-- Leagues/Tournaments -->
            <div v-if="tournaments.length > 0" class="space-y-4 animate-fade-in-up" style="animation-delay: 100ms">
                <h2 class="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <span class="material-symbols-outlined text-yellow-500">emoji_events</span>
                    {{ $t('search.tournaments') }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="tournament in tournaments" :key="tournament.id"
                        :to="localePath(`/tournaments/${tournament.id}`)"
                        class="group bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark hover:border-primary-500 transition-all flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                            <span class="material-symbols-outlined text-2xl">trophy</span>
                        </div>
                        <div>
                            <h3
                                class="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                                {{ tournament.name }}
                            </h3>
                            <p class="text-xs text-gray-500">{{ tournament.league_name }}</p>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <!-- No Results -->
            <div v-if="totalResults === 0"
                class="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('search.no_results_title') }}
                </h3>
                <p class="text-gray-500">{{ $t('search.no_results_subtitle', { query: route.query.q }) }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'

const route = useRoute()
const { $api } = useNuxtApp()
const localePath = useLocalePath()

const loading = ref(false)
const teams = ref<any[]>([])
const tournaments = ref<any[]>([])

// Placeholder for total count logic
const totalResults = computed(() => teams.value.length + tournaments.value.length)

const performSearch = async () => {
    const query = route.query.q as string
    if (!query) return

    loading.value = true
    try {
        // Parallel requests for teams and tournaments
        // Ideally your API should have a unified /search endpoint, but we'll use specific ones based on standard filtering patterns
        // Assuming API supports filtering by name via query param, e.g. ?name=query
        const [teamsRes, tournamentsRes] = await Promise.all([
            $api.get(`/teams?search=${query}`), // Adjust endpoint if needed
            $api.get(`/tournaments?search=${query}`) // Adjust endpoint if needed
        ])

        // Handle Teams
        if (teamsRes.data.success) {
            teams.value = teamsRes.data.data
        } else {
            teams.value = []
        }

        // Handle Tournaments
        if (tournamentsRes.data.success) {
            tournaments.value = tournamentsRes.data.data
        } else {
            tournaments.value = []
        }

        // NOTE: If your API doesn't support ?search=... directly on these endpoints, 
        // you might need to fetch all and filter client-side (not recommended for large datasets).
        // For now assuming the API handles it or returns a list we can filter client-side just in case:
        if (!teamsRes.data.success || !teamsRes.config.params?.search) {
            // Fallback client-side filter if needed
            const allTeams = teamsRes.data.data || []
            teams.value = allTeams.filter((t: any) => t.name.toLowerCase().includes(query.toLowerCase()))
        }

        if (!tournamentsRes.data.success || !tournamentsRes.config.params?.search) {
            // Fallback client-side filter
            const allTournaments = tournamentsRes.data.data || []
            tournaments.value = allTournaments.filter((t: any) => t.name.toLowerCase().includes(query.toLowerCase()))
        }

    } catch (error) {
        console.error('Search error:', error)
        teams.value = []
        tournaments.value = []
    } finally {
        loading.value = false
    }
}

watch(() => route.query.q, () => {
    performSearch()
}, { immediate: true })

</script>
