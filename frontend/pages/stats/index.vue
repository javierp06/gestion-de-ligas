<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1
                    class="text-3xl font-display font-bold text-text-primary-light dark:text-white uppercase tracking-tight">
                    Estadísticas <span class="text-primary-500">Globales</span>
                </h1>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                    Consulta los líderes en goles, asistencias y disciplina de todos los torneos.
                </p>
            </div>

            <!-- Tabs -->
            <div class="flex space-x-4 mb-8 overflow-x-auto pb-2">
                <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
                    class="px-6 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap"
                    :class="currentTab === tab.id
                        ? 'bg-primary-500 text-white shadow-neon'
                        : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined">{{ tab.icon }}</span>
                        {{ tab.label }}
                    </div>
                </button>
            </div>

            <!-- Content -->
            <div
                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden min-h-[400px]">

                <!-- Loading State -->
                <div v-if="pending" class="flex flex-col items-center justify-center h-64">
                    <span
                        class="material-symbols-outlined text-4xl text-primary-500 animate-spin mb-4">progress_activity</span>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark font-medium">Cargando
                        estadísticas...</p>
                </div>

                <!-- Data Table -->
                <div v-else-if="currentData && currentData.length > 0" class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 dark:bg-white/5 border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Pos</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Jugador</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    Equipo</th>
                                <th
                                    class="px-6 py-4 text-right text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                                    {{ currentTab === 'cards' ? 'Tarjetas' : (currentTab === 'assists' ? 'Asistencias' : 'Goles') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border-light dark:divide-border-dark">
                            <tr v-for="(item, index) in currentData" :key="index"
                                class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                                        :class="index < 3 ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' : 'text-text-secondary-light dark:text-text-secondary-dark'">
                                        {{ index + 1 }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-3">
                                            <img v-if="item.player_photo" :src="item.player_photo"
                                                :alt="item.player_name" class="h-full w-full object-cover">
                                            <span v-else class="material-symbols-outlined text-gray-400">person</span>
                                        </div>
                                        <div class="text-sm font-bold text-text-primary-light dark:text-white">
                                            {{ item.player_name }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div
                                        class="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                                        {{ item.team_name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <div v-if="currentTab === 'cards'" class="flex items-center justify-end gap-3">
                                        <span
                                            class="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">
                                            <span class="w-2 h-3 bg-yellow-500 rounded-sm inline-block"></span>
                                            {{ item.yellow_cards }}
                                        </span>
                                        <span
                                            class="flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">
                                            <span class="w-2 h-3 bg-red-500 rounded-sm inline-block"></span>
                                            {{ item.red_cards }}
                                        </span>
                                    </div>
                                    <span v-else class="text-lg font-black text-primary-600 dark:text-primary-500">
                                        {{ currentTab === 'assists' ? item.assists : item.goals }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center h-96 text-center p-8">
                    <div
                        class="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <span class="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-600">
                            {{ currentTab === 'cards' ? 'style' : (currentTab === 'assists' ? 'handshake' : 'sports_soccer') }}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-text-primary-light dark:text-white mb-2">
                        No hay datos disponibles
                    </h3>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark max-w-md mx-auto">
                        Aún no se han registrado estadísticas para esta categoría. ¡Comienza a jugar partidos para ver
                        los resultados aquí!
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNuxtApp, useAsyncData } from '#app'

const { $api } = useNuxtApp()

const currentTab = ref('scorers')

const tabs = [
    { id: 'scorers', label: 'Goleadores', icon: 'sports_soccer' },
    { id: 'assists', label: 'Asistencias', icon: 'handshake' },
    { id: 'cards', label: 'Tarjetas', icon: 'style' }
]

// Fetch data based on current tab
const { data: statsData, pending, refresh } = await useAsyncData('stats-data', async () => {
    let endpoint = '/stats/scorers'

    if (currentTab.value === 'assists') {
        endpoint = '/stats/assists'
    } else if (currentTab.value === 'cards') {
        endpoint = '/stats/cards'
    }

    const response = await $api.get(endpoint)
    return response.data.success ? response.data.data : []
}, {
    watch: [currentTab]
})

const currentData = computed(() => statsData.value || [])

definePageMeta({
    layout: 'default'
})
</script>
