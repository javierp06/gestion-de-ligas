<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')">
        <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary-500">edit</span>
                    Editar Torneo
                </h3>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Images Section -->
                    <div class="space-y-4">
                        <h4
                            class="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            Imágenes
                        </h4>
                        <!-- Stack vertically on mobile, slightly larger grid on desktop, but since ImageUpload is wide, maybe vertical is safer for now or 1 col -->
                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <ImageUpload ref="logoUpload" label="Logo del Torneo" v-model="formData.logo" />
                            </div>
                            <div>
                                <ImageUpload ref="coverUpload" label="Foto de Portada" v-model="formData.cover_photo" />
                            </div>
                        </div>
                    </div>

                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <h4
                            class="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            Información Básica
                        </h4>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Nombre del Torneo <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.name" type="text" required
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                                placeholder="Ej. Copa de Verano 2024" />
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Descripción
                            </label>
                            <textarea v-model="formData.description" rows="3"
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white resize-none"
                                placeholder="Breve descripción del torneo..."></textarea>
                        </div>
                    </div>

                    <!-- Settings -->
                    <div class="space-y-4">
                        <h4
                            class="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            Configuración
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Formato
                                </label>
                                <select v-model="formData.format"
                                    class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white">
                                    <option value="league">Liga</option>
                                    <option value="knockout">Eliminatoria</option>
                                    <option value="group_knockout">Grupos + Eliminatoria</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Estado
                                </label>
                                <select v-model="formData.status"
                                    class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white">
                                    <option value="upcoming">Inscripciones (Próximo)</option>
                                    <option value="in_progress">En Curso</option>
                                    <option value="finished">Finalizado</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Fecha de Inicio
                                </label>
                                <input v-model="formData.start_date" type="date" required
                                    class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white" />
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Fecha de Fin (Opcional)
                                </label>
                                <input v-model="formData.end_date" type="date"
                                    class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                Límite de Equipos
                            </label>
                            <input v-model="formData.max_teams" type="number" min="2"
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                                placeholder="Opcional" />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="pt-4 flex gap-3">
                        <button type="button" @click="$emit('close')"
                            class="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="loading"
                            class="flex-1 px-4 py-2 rounded-xl bg-primary-500 text-black font-bold hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="loading"
                                class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNuxtApp } from '#app'
import { useToastStore } from '@/stores/toast'
import ImageUpload from '@/components/ImageUpload.vue'

const props = defineProps<{
    tournament: any
}>()

const emit = defineEmits<{
    close: [],
    updated: []
}>()

const { $api } = useNuxtApp()
const toastStore = useToastStore()

const loading = ref(false)
const logoUpload = ref()
const coverUpload = ref()

// Initialize form data with existing tournament data
const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
}

const formData = reactive({
    name: props.tournament.name || '',
    description: props.tournament.description || '',
    format: props.tournament.format || 'league',
    status: props.tournament.status || 'upcoming',
    start_date: formatDateForInput(props.tournament.start_date),
    end_date: formatDateForInput(props.tournament.end_date),
    max_teams: props.tournament.max_teams || '',
    logo: props.tournament.logo || null,
    cover_photo: props.tournament.cover_photo || null
})

const handleSubmit = async () => {
    loading.value = true
    try {
        // Upload images first
        const logoUrl = await logoUpload.value.upload()
        const coverUrl = await coverUpload.value.upload()

        const payload = {
            ...formData,
            logo: logoUrl,
            cover_photo: coverUrl
        }

        // Clean up empty fields
        if (!payload.end_date) delete payload.end_date
        if (!payload.max_teams) delete payload.max_teams

        const response = await $api.put(`/tournaments/${props.tournament.id}`, payload)

        if (response.data.success) {
            toastStore.success('Torneo actualizado exitosamente')
            emit('updated')
            emit('close')
        }
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || 'Error al actualizar el torneo')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
}
</style>
