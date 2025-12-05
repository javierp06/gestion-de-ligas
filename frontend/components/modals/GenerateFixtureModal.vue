<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="$emit('close')"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                            <span
                                class="material-symbols-outlined text-blue-600 dark:text-blue-400">calendar_month</span>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                Generar Calendario Automático
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Genera automáticamente todos los partidos del torneo usando un formato de "Todos
                                    contra Todos" (Round Robin).
                                </p>

                                <form @submit.prevent="handleSubmit" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Fecha de Inicio
                                        </label>
                                        <input type="date" v-model="formData.start_date" required
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white">
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Días entre jornadas
                                        </label>
                                        <input type="number" v-model="formData.interval_days" min="1" required
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white">
                                        <p class="text-xs text-gray-500 mt-1">Ej: 7 para jugar cada semana</p>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <input type="checkbox" v-model="formData.has_return_leg" id="return_leg"
                                            class="rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600">
                                        <label for="return_leg"
                                            class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ida y Vuelta
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="handleSubmit" type="button" :disabled="loading"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="loading"
                            class="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
                        {{ loading ? 'Generando...' : 'Generar Calendario' }}
                    </button>
                    <button @click="$emit('close')" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
    tournamentId: number
}>()

const emit = defineEmits(['close', 'created'])
const { $api } = useNuxtApp()
const toastStore = useToastStore()
const loading = ref(false)

const formData = reactive({
    start_date: new Date().toISOString().split('T')[0],
    interval_days: 7,
    has_return_leg: false
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const response = await $api.post('/matches/generate-fixture', {
            tournament_id: props.tournamentId,
            ...formData
        })

        if (response.data.success) {
            toastStore.success(`Se generaron ${response.data.data.matches_count} partidos exitosamente`)
            emit('created')
            emit('close')
        }
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || 'Error al generar el calendario')
    } finally {
        loading.value = false
    }
}
</script>
