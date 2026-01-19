<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')">
        <div class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary-500">add_circle</span>
                    {{ $t('modals.create_match.title') }}
                </h3>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Form -->
            <div class="p-6">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Teams Selection -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {{ $t('modals.create_match.home_team') }} <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.home_team_id" required
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white">
                                <option value="" disabled>{{ $t('modals.create_match.select_team') }}</option>
                                <option v-for="team in teams" :key="team.id" :value="team.id"
                                    :disabled="team.id === formData.away_team_id">
                                    {{ team.name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {{ $t('modals.create_match.away_team') }} <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.away_team_id" required
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white">
                                <option value="" disabled>{{ $t('modals.create_match.select_team') }}</option>
                                <option v-for="team in teams" :key="team.id" :value="team.id"
                                    :disabled="team.id === formData.home_team_id">
                                    {{ team.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Date & Round -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {{ $t('modals.create_match.date_time') }} <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.match_date" type="datetime-local" required
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {{ $t('modals.create_match.round') }} <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.round" type="number" min="1" required
                                class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white" />
                        </div>
                    </div>

                    <!-- Location & Referee -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                            {{ $t('modals.create_match.location') }}
                        </label>
                        <input v-model="formData.location" type="text"
                            class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                            :placeholder="$t('modals.create_match.location_placeholder')" />
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                            {{ $t('modals.create_match.referee') }}
                        </label>
                        <input v-model="formData.referee" type="text"
                            class="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dark:text-white"
                            :placeholder="$t('modals.create_match.referee_placeholder')" />
                    </div>

                    <!-- Actions -->
                    <div class="pt-4 flex gap-3">
                        <button type="button" @click="$emit('close')"
                            class="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {{ $t('modals.create_match.cancel') }}
                        </button>
                        <button type="submit" :disabled="loading"
                            class="flex-1 px-4 py-2 rounded-xl bg-primary-500 text-black font-bold hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <span v-if="loading"
                                class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            {{ loading ? $t('modals.create_match.creating') : $t('modals.create_match.submit') }}
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
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    tournamentId: number
    teams: any[]
}>()

const emit = defineEmits<{
    close: [],
    created: []
}>()

const { $api } = useNuxtApp()
const toastStore = useToastStore()
const { t } = useI18n()
const loading = ref(false)

const formData = reactive({
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    round: 1,
    location: '',
    referee: ''
})

const handleSubmit = async () => {
    loading.value = true
    try {
        if (formData.home_team_id === formData.away_team_id) {
            toastStore.error(t('modals.create_match.same_team_error'))
            loading.value = false
            return
        }

        const payload = {
            ...formData,
            tournament_id: props.tournamentId
        }

        const response = await $api.post('/matches', payload)

        if (response.data.success) {
            toastStore.success(t('modals.create_match.success'))
            emit('created')
            emit('close')
        }
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || t('modals.create_match.error'))
    } finally {
        loading.value = false
    }
}
</script>
