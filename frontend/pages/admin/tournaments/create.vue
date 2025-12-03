<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <button @click="navigateTo('/tournaments')"
                    class="flex items-center text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 transition-colors mb-4">
                    <span class="material-symbols-outlined mr-1">arrow_back</span>
                    Volver a Torneos
                </button>
                <h1 class="text-3xl font-display font-bold text-text-primary-light dark:text-white">Crear Nuevo Torneo
                </h1>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mt-2">Configura los detalles de tu
                    próximo campeonato.</p>
            </div>

            <div
                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-slide-up">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <h2
                            class="text-xl font-bold text-text-primary-light dark:text-white flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-2">
                            <span class="material-symbols-outlined text-primary-500">info</span>
                            Información Básica
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-2">
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Nombre del Torneo
                                </label>
                                <input v-model="form.name" type="text" required
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    placeholder="Ej. Copa Verano 2024" />
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Descripción
                                </label>
                                <textarea v-model="form.description" rows="3"
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    placeholder="Detalles sobre el torneo..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- League & Format -->
                    <div class="space-y-4">
                        <h2
                            class="text-xl font-bold text-text-primary-light dark:text-white flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-2">
                            <span class="material-symbols-outlined text-primary-500">settings</span>
                            Configuración de Liga
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Liga Asociada
                                </label>
                                <select v-model="form.league_id" required @change="handleLeagueChange"
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                                    <option value="" disabled>Selecciona una liga</option>
                                    <option v-for="league in leagues" :key="league.id" :value="league.id">
                                        {{ league.name }}
                                    </option>
                                </select>
                                <p v-if="!leagues.length" class="text-xs text-red-500 mt-1">
                                    No tienes ligas creadas. <button type="button"
                                        @click="navigateTo('/admin/leagues/create')" class="underline">Crear
                                        una</button>
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Deporte
                                </label>
                                <div
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark cursor-not-allowed">
                                    {{ selectedLeagueSport || 'Selecciona una liga' }}
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Formato
                                </label>
                                <select v-model="form.format" required
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                                    <option value="league">Liga (Todos contra todos)</option>
                                    <option value="knockout">Eliminación Directa</option>
                                    <option value="group_knockout">Fase de Grupos + Eliminación</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Máximo de Equipos
                                </label>
                                <input v-model="form.max_teams" type="number" min="2"
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    placeholder="Ej. 16" />
                            </div>
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="space-y-4">
                        <h2
                            class="text-xl font-bold text-text-primary-light dark:text-white flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-2">
                            <span class="material-symbols-outlined text-primary-500">calendar_today</span>
                            Fechas
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Fecha de Inicio
                                </label>
                                <input v-model="form.start_date" type="date" required
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                    Fecha de Fin (Estimada)
                                </label>
                                <input v-model="form.end_date" type="date"
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-4 pt-6 border-t border-border-light dark:border-border-dark">
                        <button type="button" @click="navigateTo('/tournaments')"
                            class="px-6 py-3 rounded-xl font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="loading"
                            class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
                            <span v-else class="material-symbols-outlined">add</span>
                            {{ loading ? 'Creando...' : 'Crear Torneo' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp, navigateTo, definePageMeta } from '#app'
import { useAuthStore } from '@/stores/auth'

const { $api } = useNuxtApp()
const authStore = useAuthStore()

const loading = ref(false)
const leagues = ref<any[]>([])

const form = ref({
    name: '',
    description: '',
    league_id: '',
    format: 'league',
    max_teams: '',
    start_date: '',
    end_date: ''
})

const selectedLeagueSport = computed(() => {
    const league = leagues.value.find(l => l.id === form.value.league_id)
    return league ? (league.sport_name || league.sport?.name) : ''
})

const fetchLeagues = async () => {
    try {
        const response = await $api.get('/leagues')
        if (response.data.success) {
            // Filter leagues where user is organizer, unless admin
            const allLeagues = response.data.data
            if (authStore.isAdmin) {
                leagues.value = allLeagues
            } else {
                leagues.value = allLeagues.filter((l: any) => l.organizer_id === authStore.user?.id)
            }
        }
    } catch (error) {
        console.error('Error fetching leagues:', error)
    }
}

const handleLeagueChange = () => {
    // Optional: Reset sport dependent fields if needed
}

const handleSubmit = async () => {
    loading.value = true
    try {
        const payload = {
            ...form.value,
            max_teams: form.value.max_teams ? parseInt(form.value.max_teams as string) : null
        }

        const response = await $api.post('/tournaments', payload)

        if (response.data.success) {
            navigateTo('/tournaments')
        }
    } catch (error) {
        console.error('Error creating tournament:', error)
        alert('Error al crear el torneo. Por favor verifica los datos.')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchLeagues()
})

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
