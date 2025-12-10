<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div
                class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('modals.edit_team.title') }}</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('modals.edit_team.name_label') }}</label>
                        <input v-model="formData.name" type="text" required class="input-field" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('modals.edit_team.short_name_label') }}</label>
                        <input v-model="formData.short_name" type="text" class="input-field" :placeholder="$t('modals.edit_team.short_name_placeholder')" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('modals.edit_team.stadium_label') }}</label>
                        <input v-model="formData.stadium" type="text" class="input-field" />
                    </div>

                </div>

                <!-- Images -->
                <div class="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('modals.edit_team.images_title') }}</h3>

                    <ImageUpload :label="$t('modals.edit_team.logo_label')" v-model="formData.logo" ref="logoUpload" />

                    <ImageUpload :label="$t('modals.edit_team.cover_label')" v-model="formData.cover_photo" :circle="false" ref="coverUpload" />
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
                        {{ $t('modals.edit_team.cancel') }}
                    </button>
                    <button type="submit"
                        class="ml-auto btn-primary px-8 py-2 rounded-lg font-bold flex items-center gap-2"
                        :disabled="loading">
                        <span v-if="loading" class="animate-spin material-symbols-outlined">progress_activity</span>
                        <span>{{ loading ? $t('modals.edit_team.saving') : $t('modals.edit_team.save') }}</span>
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
const { t } = useI18n()

const props = defineProps<{
    team: any
}>()

const emit = defineEmits<{
    close: []
    updated: []
}>()

const loading = ref(false)
const error = ref('')

// Refs
const logoUpload = ref()
const coverUpload = ref()

const formData = ref({
    name: props.team.name,
    short_name: props.team.short_name,
    logo: props.team.logo,
    cover_photo: props.team.cover_photo,
    stadium: props.team.stadium
})

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    try {
        // Upload images if awaiting
        const logoUrl = await logoUpload.value.upload()
        const coverUrl = await coverUpload.value.upload()
        
        if (logoUrl) formData.value.logo = logoUrl
        if (coverUrl) formData.value.cover_photo = coverUrl

        const response = await $api.put(`/teams/${props.team.id}`, formData.value)

        if (response.data.success) {
            toastStore.success(t('modals.edit_team.success'))
            emit('updated')
            emit('close')
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || t('modals.edit_team.error')
        toastStore.error(error.value)
    } finally {
        loading.value = false
    }
}
</script>
