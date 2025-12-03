<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                class="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-xl overflow-hidden">

                <!-- Header -->
                <div class="bg-primary-500 p-8 text-center">
                    <div
                        class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span class="material-symbols-outlined text-4xl text-white">emoji_events</span>
                    </div>
                    <h1 class="text-3xl font-display font-bold text-white mb-2">Crear Nueva Liga</h1>
                    <p class="text-white/80">Configura tu liga y comienza a gestionar torneos</p>
                </div>

                <!-- Form -->
                <div class="p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">

                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                Nombre de la Liga <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" type="text" required placeholder="Ej: Liga Premier 2024"
                                class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-text-primary-light dark:text-white" />
                        </div>

                        <!-- Sport -->
                        <div>
                            <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                Deporte <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select v-model="form.sport_id" required
                                    class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-text-primary-light dark:text-white appearance-none cursor-pointer">
                                    <option value="" disabled>Selecciona un deporte</option>
                                    <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                                        {{ sport.icon }} {{ sport.name }}
                                    </option>
                                </select>
                                <span
                                    class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark material-symbols-outlined">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        <!-- Location -->
                        <div>
                            <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                Ubicación <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark material-symbols-outlined">
                                    location_on
                                </span>
                                <input v-model="form.location" type="text" required
                                    placeholder="Ej: Tegucigalpa, Honduras"
                                    class="w-full pl-12 pr-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-text-primary-light dark:text-white" />
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
                                Descripción
                            </label>
                            <textarea v-model="form.description" rows="4" placeholder="Describe tu liga..."
                                class="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-text-primary-light dark:text-white resize-none"></textarea>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-4">
                            <button type="submit" :disabled="loading"
                                class="w-full py-4 rounded-xl bg-primary-500 text-black font-bold text-lg shadow-neon hover:shadow-neon-strong hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="loading"
                                    class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                <span v-else>Crear Liga</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLeagueStore } from '@/stores/league';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const leagueStore = useLeagueStore();
const toastStore = useToastStore();
const { $api } = useNuxtApp();

const loading = ref(false);
const sports = ref<any[]>([]);

const form = ref({
    name: '',
    description: '',
    sport_id: '',
    location: ''
});

const fetchSports = async () => {
    try {
        const response = await $api.get('/sports');
        if (response.data.success) {
            sports.value = response.data.data;
        }
    } catch (error) {
        console.error('Error fetching sports:', error);
        toastStore.error('Error al cargar los deportes');
    }
};

const handleSubmit = async () => {
    if (!form.value.name || !form.value.sport_id || !form.value.location) {
        toastStore.warning('Por favor completa los campos requeridos');
        return;
    }

    loading.value = true;

    try {
        const result = await leagueStore.createLeague({
            ...form.value,
            sport_id: parseInt(form.value.sport_id)
        });

        if (result.success) {
            toastStore.success('¡Liga creada exitosamente!');
            router.push('/leagues');
        } else {
            toastStore.error(result.message || 'Error al crear la liga');
        }
    } catch (error) {
        console.error('Error creating league:', error);
        toastStore.error('Ocurrió un error inesperado');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchSports();
});

definePageMeta({
    layout: 'default',
    middleware: ['auth'] // Ensure user is logged in
});
</script>
