<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div
                class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Liga</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

                <!-- Basic Info -->
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre de la Liga</label>
                        <input v-model="formData.name" type="text" required class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ubicación</label>
                        <input v-model="formData.location" type="text" class="input-field" placeholder="Ej: San Pedro Sula" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                    <textarea v-model="formData.description" rows="3" class="input-field"></textarea>
                </div>

                <!-- Images -->
                <div class="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Imágenes</h3>
                    
                    <ImageUpload label="Logo de la Liga" v-model="formData.logo" ref="logoUpload" />

                    <ImageUpload label="Portada" v-model="formData.cover_photo" :circle="false" ref="coverUpload" />
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
import ImageUpload from '@/components/ImageUpload.vue'

const { $api } = useNuxtApp()
const toastStore = useToastStore()

const props = defineProps<{
    league: any
}>()

const emit = defineEmits<{
    close: []
    updated: []
}>()

const loading = ref(false)
const error = ref('')

// Refs for ImageUpload components
const logoUpload = ref()
const coverUpload = ref()

const formData = ref({
    name: props.league.name,
    description: props.league.description,
    location: props.league.location,
    logo: props.league.logo,
    cover_photo: props.league.cover_photo,
    status: props.league.status,
    settings: props.league.settings // Preserve existing settings
})

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    try {
        // Upload images if changed/pending
        const logoUrl = await logoUpload.value.upload()
        const coverUrl = await coverUpload.value.upload()

        if (logoUrl) formData.value.logo = logoUrl
        if (coverUrl) formData.value.cover_photo = coverUrl

        const response = await $api.put(`/leagues/${props.league.id}`, formData.value)

        if (response.data.success) {
            toastStore.success('Liga actualizada exitosamente')
            emit('updated')
            emit('close')
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error al actualizar la liga'
        toastStore.error(error.value)
    } finally {
        loading.value = false
    }
}
</script>
