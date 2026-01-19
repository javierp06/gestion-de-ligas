<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="$emit('close')"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 sm:mx-0 sm:h-10 sm:w-10">
                            <span
                                class="material-symbols-outlined text-purple-600 dark:text-purple-400">emoji_events</span>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                {{ $t('modals.generate_playoffs.title') }}
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {{ $t('modals.generate_playoffs.description') }}
                                </p>

                                <form @submit.prevent="handleSubmit" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {{ $t('modals.generate_playoffs.start_date') }}
                                        </label>
                                        <input type="date" v-model="formData.start_date" required
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white">
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {{ $t('modals.generate_playoffs.interval_days') }}
                                        </label>
                                        <input type="number" v-model="formData.interval_days" min="1" required
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white">
                                        <p class="text-xs text-gray-500 mt-1">
                                            {{ $t('modals.generate_playoffs.interval_note') }}</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="handleSubmit" type="button" :disabled="loading"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="loading"
                            class="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
                        {{ loading ? $t('modals.generate_playoffs.generating') : $t('modals.generate_playoffs.submit') }}
                    </button>
                    <button @click="$emit('close')" type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        {{ $t('modals.generate_playoffs.cancel') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    tournamentId: number
}>()

const emit = defineEmits(['close', 'created'])
const { $api } = useNuxtApp()
const toastStore = useToastStore()
const { t } = useI18n()
const loading = ref(false)

const formData = reactive({
    start_date: new Date().toISOString().split('T')[0],
    interval_days: 4
})

const handleSubmit = async () => {
    loading.value = true
    try {
        const payload = {
            tournament_id: props.tournamentId,
            start_date: formData.start_date,
            interval_days: formData.interval_days
        }

        const response = await $api.post('/matches/generate-playoffs', payload)

        if (response.data.success) {
            toastStore.success(t('modals.generate_playoffs.success'))
            emit('created')
            emit('close')
        }
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || t('modals.generate_playoffs.error'))
    } finally {
        loading.value = false
    }
}
</script>
