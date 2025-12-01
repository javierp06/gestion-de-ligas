<template>
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white mb-2">
                Crear Nueva Liga
            </h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">
                Configura los detalles básicos de tu nueva liga deportiva.
            </p>
        </div>

        <!-- Form Card -->
        <div
            class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
            <form @submit.prevent="handleSubmit" class="p-8 space-y-6">

                <!-- Name -->
                <div>
                    <label for="name"
                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                        Nombre de la Liga *
                    </label>
                    <input v-model="formData.name" type="text" id="name" required
                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                        placeholder="Ej: Liga Premier de Fútbol" />
                </div>

                <!-- Description -->
                <div>
                    <label for="description"
                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                        Descripción
                    </label>
                    <textarea v-model="formData.description" id="description" rows="3"
                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none"
                        placeholder="Breve descripción de la liga..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Sport -->
                    <div>
                        <label for="sport"
                            class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                            Deporte *
                        </label>
                        <div class="relative">
                            <select v-model="formData.sport_id" id="sport" required
                                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium appearance-none cursor-pointer">
                                <option value="" disabled>Selecciona un deporte</option>
                                <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                                    {{ sport.icon }} {{ sport.name }}
                                </option>
                            </select>
                            <div
                                class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark">
                                <span class="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="location"
                            class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                            Ubicación / Sede *
                        </label>
                        <input v-model="formData.location" type="text" id="location" required
                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                            placeholder="Ej: Ciudad Deportiva" />
                    </div>
                </div>

                <!-- Logo URL (Temporary) -->
                <div>
                    <label for="logo"
                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                        URL del Logo
                    </label>
                    <div class="flex gap-4">
                        <input v-model="formData.logo" type="url" id="logo"
                            class="flex-1 bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                            placeholder="https://ejemplo.com/logo.png" />

                        <div
                            class="w-12 h-12 rounded-xl bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden">
                            <img v-if="formData.logo" :src="formData.logo" alt="Preview"
                                class="w-full h-full object-cover" @error="handleImageError" />
                            <span v-else
                                class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">image</span>
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
                        <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
                        <span>{{ loading ? 'Creando...' : 'Crear Liga' }}</span>
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { $api } = useNuxtApp()
const toastStore = useToastStore()

const loading = ref(false)
const sports = ref([])

const formData = ref({
    name: '',
    description: '',
    sport_id: '',
    location: '',
    logo: ''
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

const handleImageError = (e: Event) => {
    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo'
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
