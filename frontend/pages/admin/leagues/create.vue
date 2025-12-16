<template>
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 animate-fade-in">
            <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white mb-2">
                Crear Nueva Liga
            </h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">
                Configura los detalles y personaliza la apariencia de tu liga.
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Form Column -->
            <div class="lg:col-span-2 space-y-6 animate-slide-up">
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
                    <form @submit.prevent="handleSubmit" class="p-8 space-y-6">

                        <!-- Name -->
                        <div>
                            <label for="name"
                                class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                Nombre de la Liga <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span
                                    class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">emoji_events</span>
                                <input v-model="formData.name" type="text" id="name" required
                                    class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                    placeholder="Ej: Liga Premier de Fútbol" />
                            </div>
                        </div>

                        <!-- Sport & Location -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="sport"
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    Deporte <span class="text-red-500">*</span>
                                </label>
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">sports_soccer</span>
                                    <select v-model="formData.sport_id" id="sport" required
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-10 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium appearance-none cursor-pointer">
                                        <option value="" disabled>Selecciona un deporte</option>
                                        <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                                            {{ sport.name }}
                                        </option>
                                    </select>
                                    <span
                                        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark material-symbols-outlined">expand_more</span>
                                </div>
                            </div>

                            <div>
                                <label for="location"
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    Ubicación <span class="text-red-500">*</span>
                                </label>
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">location_on</span>
                                    <input v-model="formData.location" type="text" id="location" required
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        placeholder="Ej: Ciudad Deportiva" />
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label for="description"
                                class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                Descripción
                            </label>
                            <textarea v-model="formData.description" id="description" rows="4"
                                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none"
                                placeholder="Describe el propósito y las reglas generales de tu liga..."></textarea>
                        </div>

                        <!-- Logo Selection -->
                        <div>
                            <label
                                class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4">
                                Logo de la Liga
                            </label>

                            <!-- Custom URL Input -->
                            <div class="mb-4">
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">link</span>
                                    <input v-model="formData.logo" type="url"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        placeholder="https://ejemplo.com/logo.png" />
                                </div>
                            </div>


                        </div>

                        <!-- Advanced Settings -->
                        <div class="pt-6 border-t border-border-light dark:border-border-dark">
                            <h3
                                class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary-500">settings</span>
                                Configuración de Reglas (Opcional)
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Match Duration -->
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        Duración Partido (min)
                                    </label>
                                    <input v-model.number="formData.settings.match_duration" type="number" min="1"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        placeholder="Ej: 90" />
                                </div>

                                <!-- Players per Team -->
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        Jugadores por Equipo
                                    </label>
                                    <input v-model.number="formData.settings.players_per_team" type="number" min="1"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        placeholder="Ej: 11" />
                                </div>
                            </div>

                            <div class="mt-6">
                                <label
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    Sistema de Puntuación
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Victoria</span>
                                        <input v-model.number="formData.settings.points_win" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-center"
                                            placeholder="3" />
                                    </div>
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Empate</span>
                                        <input v-model.number="formData.settings.points_draw" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-center"
                                            placeholder="1" />
                                    </div>
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Derrota</span>
                                        <input v-model.number="formData.settings.points_loss" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-center"
                                            placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div
                            class="pt-6 flex items-center justify-end gap-4 border-t border-border-light dark:border-border-dark">
                            <button type="button" @click="router.back()"
                                class="px-6 py-3 rounded-xl font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="loading"
                                class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading"
                                    class="material-symbols-outlined animate-spin">progress_activity</span>
                                <span>{{ loading ? 'Creando...' : 'Crear Liga' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Preview Column -->
            <div class="lg:col-span-1 animate-slide-up stagger-1">
                <div class="sticky top-24">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">visibility</span>
                        Vista Previa
                    </h3>

                    <!-- League Card Preview -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
                        <!-- Cover/Header -->
                        <div class="h-32 bg-gradient-to-br from-primary-600 to-primary-900 relative overflow-hidden">
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                            <div class="absolute bottom-0 left-0 w-full p-4 flex items-end gap-4 translate-y-1/2">
                                <div class="w-20 h-20 rounded-2xl bg-surface-light dark:bg-surface-dark p-1 shadow-lg">
                                    <img :src="formData.logo || 'https://ui-avatars.com/api/?name=Liga&background=random'"
                                        class="w-full h-full object-cover rounded-xl bg-gray-100 dark:bg-white/5"
                                        @error="handleImageError" />
                                </div>
                            </div>
                        </div>

                        <div class="pt-12 px-6 pb-6">
                            <div class="mb-4">
                                <h3
                                    class="text-xl font-display font-bold text-text-primary-light dark:text-white leading-tight mb-1">
                                    {{ formData.name || 'Nombre de la Liga' }}
                                </h3>
                                <div
                                    class="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                    <span class="material-symbols-outlined text-base">location_on</span>
                                    {{ formData.location || 'Ubicación' }}
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-500/20">
                                    {{ getSportName(formData.sport_id) }}
                                </span>
                                <span
                                    class="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20">
                                    Activa
                                </span>
                            </div>

                            <p
                                class="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-3 mb-4">
                                {{ formData.description || 'Descripción de la liga...' }}
                            </p>

                            <div
                                class="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                                <div class="flex -space-x-2">
                                    <div v-for="i in 3" :key="i"
                                        class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                                        {{ i }}
                                    </div>
                                </div>
                                <span
                                    class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">0
                                    Equipos</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tips Card -->
                    <div class="mt-6 bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                        <div class="flex gap-3">
                            <span class="material-symbols-outlined text-blue-500">lightbulb</span>
                            <div>
                                <h4 class="font-bold text-blue-600 dark:text-blue-400 text-sm mb-1">Consejo Pro</h4>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    Una buena descripción y un logo atractivo aumentan la participación en tu liga.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const { $api } = useNuxtApp()
const toastStore = useToastStore()

const loading = ref(false)
const sports = ref<{ id: number; name: string }[]>([])

const formData = ref({
    name: '',
    description: '',
    sport_id: '',
    location: '',
    logo: '',
    settings: {
        match_duration: null,
        players_per_team: null,
        points_win: 3,
        points_draw: 1,
        points_loss: 0
    }
})



// Fetch sports on mount
onMounted(async () => {
    try {
        const response = await $api.get('/sports')
        if (response.data.success) {
            sports.value = response.data.data
        }
    } catch (error) {
        console.error('Error fetching sports:', error)
        toastStore.error('Error al cargar los deportes')
    }
})

const getSportName = (id: string | number) => {
    if (!id) return 'Deporte'
    const sport = sports.value.find(s => s.id == id)
    return sport ? sport.name : 'Deporte'
}

const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement
    const fallbackUrl = 'https://ui-avatars.com/api/?name=Liga&background=random'

    if (target.src !== fallbackUrl) {
        target.src = fallbackUrl
    }
}

const handleSubmit = async () => {
    loading.value = true
    try {
        const response = await $api.post('/leagues', formData.value)

        if (response.data.success) {
            toastStore.success(response.data.message)
            // Redirect to leagues list or the new league details
            router.push('/leagues')
        }
    } catch (error: any) {
        const msg = error.response?.data?.message || 'Error al crear la liga'
        toastStore.error(msg)
    } finally {
        loading.value = false
    }
}

definePageMeta({
    middleware: ['auth']
})
</script>
