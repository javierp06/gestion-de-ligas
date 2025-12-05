<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div
                class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Equipo</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre del
                            Equipo</label>
                        <input v-model="formData.name" type="text" required class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre Corto
                            (Abreviatura)</label>
                        <input v-model="formData.short_name" type="text" class="input-field" placeholder="Ej: FCB" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estadio</label>
                        <input v-model="formData.stadium" type="text" class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Año de
                            Fundación</label>
                        <input v-model="formData.founded_date" type="date" class="input-field" />
                    </div>
                </div>

                <!-- Images -->
                <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Imágenes</h3>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL del
                            Logo</label>
                        <div class="flex gap-4">
                            <input v-model="formData.logo" type="url" class="input-field flex-1"
                                placeholder="https://..." />
                            <div
                                class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                                <img v-if="formData.logo" :src="formData.logo" class="w-full h-full object-contain" />
                                <span v-else class="material-symbols-outlined text-gray-400">image</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL de Portada
                            / Foto de Equipo</label>
                        <div class="space-y-2">
                            <input v-model="formData.cover_photo" type="url" class="input-field"
                                placeholder="https://..." />
                            <div v-if="formData.cover_photo"
                                class="h-32 w-full rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 relative">
                                <img :src="formData.cover_photo" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Esta imagen se usará como fondo de cabecera.</p>
                    </div>
                </div>

                <!-- Personalization -->
                <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Personalización</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color
                                Primario</label>
                            <div class="flex items-center gap-3">
                                <input v-model="formData.primary_color" type="color"
                                    class="h-10 w-20 rounded cursor-pointer border-0 p-0" />
                                <input v-model="formData.primary_color" type="text" class="input-field"
                                    placeholder="#000000" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color
                                Secundario</label>
                            <div class="flex items-center gap-3">
                                <input v-model="formData.secondary_color" type="color"
                                    class="h-10 w-20 rounded cursor-pointer border-0 p-0" />
                                <input v-model="formData.secondary_color" type="text" class="input-field"
                                    placeholder="#FFFFFF" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Colores (Texto
                            descriptivo)</label>
                        <input v-model="formData.colors" type="text" class="input-field"
                            placeholder="Ej: Rojo y Azul" />
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error"
                    class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                    {{ error }}
                </div>

                <!-- Buttons -->
                <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" @click="$emit('close')"
                        class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="ml-auto btn-primary px-8 py-2 rounded-lg font-bold flex items-center gap-2"
                        :disabled="loading">
                        <span v-if="loading" class="animate-spin material-symbols-outlined">progress_activity</span>
                        <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const toastStore = useToastStore()

const props = defineProps<{
    team: any
}>()

const emit = defineEmits<{
    close: []
    updated: []
}>()

const loading = ref(false)
const error = ref('')

const formData = ref({
    name: props.team.name,
    short_name: props.team.short_name,
    logo: props.team.logo,
    cover_photo: props.team.cover_photo,
    stadium: props.team.stadium,
    founded_date: props.team.founded_date ? new Date(props.team.founded_date).toISOString().split('T')[0] : '',
    colors: props.team.colors,
    primary_color: props.team.primary_color || '#000000',
    secondary_color: props.team.secondary_color || '#ffffff'
})

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    try {
        const response = await $api.put(`/teams/${props.team.id}`, formData.value)

        if (response.data.success) {
            toastStore.success('Equipo actualizado exitosamente')
            emit('updated')
            emit('close')
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error al actualizar el equipo'
        toastStore.error(error.value)
    } finally {
        loading.value = false
    }
}
</script>
