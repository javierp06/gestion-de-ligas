<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')">
        <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary-500">person_add</span>
                    Agregar Jugador
                </h3>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <!-- Name -->
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nombre Completo <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.name" type="text" required
                        class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                        placeholder="Ej. Lionel Messi" />
                </div>

                <!-- Number & Position -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Dorsal
                        </label>
                        <input v-model="formData.number" type="number" min="0" max="99"
                            class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                            placeholder="#" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Posición
                        </label>
                        <select v-model="formData.position"
                            class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white appearance-none">
                            <option value="">Seleccionar</option>
                            <option value="Portero">Portero</option>
                            <option value="Defensa">Defensa</option>
                            <option value="Mediocampista">Mediocampista</option>
                            <option value="Delantero">Delantero</option>
                        </select>
                    </div>
                </div>

                <!-- Birth Date -->
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Fecha de Nacimiento
                    </label>
                    <input v-model="formData.birth_date" type="date"
                        class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white" />
                </div>

                <!-- Buttons -->
                <div class="pt-4 flex gap-3">
                    <button type="button" @click="$emit('close')"
                        class="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="loading"
                        class="flex-1 px-4 py-2 rounded-xl bg-primary-500 text-black font-bold hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="loading"
                            class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        {{ loading ? 'Guardando...' : 'Agregar Jugador' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNuxtApp } from '#app'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
    teamId: number
}>()

const emit = defineEmits<{
    close: [],
    created: []
}>()

const { $api } = useNuxtApp()
const toastStore = useToastStore()

const loading = ref(false)
const formData = reactive({
    name: '',
    number: '',
    position: '',
    birth_date: ''
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const payload = {
            ...formData,
            team_id: props.teamId
        }

        const response = await $api.post('/players', payload)

        if (response.data.success) {
            toastStore.success('Jugador agregado exitosamente')
            emit('created')
            emit('close')
        }
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || 'Error al agregar jugador')
    } finally {
        loading.value = false
    }
}
</script>
