<template>
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 animate-fade-in">
            <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white mb-2">
                {{ $t('create_league.title') }}
            </h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">
                {{ $t('create_league.subtitle') }}
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Form Column -->
            <div class="lg:col-span-2 space-y-6 animate-slide-up">
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
                    <form @submit.prevent="handleSubmit" class="p-5 md:p-8 space-y-5 md:space-y-6">

                        <!-- Name -->
                        <div>
                            <label for="name"
                                class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                {{ $t('create_league.form.name_label') }} <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <span
                                    class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">emoji_events</span>
                                <input v-model="formData.name" type="text" id="name" required
                                    class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                    :placeholder="$t('create_league.form.name_placeholder')" />
                            </div>
                        </div>

                        <!-- Sport & Location -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="sport"
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    {{ $t('create_league.form.sport_label') }} <span class="text-red-500">*</span>
                                </label>
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">sports_soccer</span>
                                    <select v-model="formData.sport_id" id="sport" required
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-10 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium appearance-none cursor-pointer">
                                        <option value="" disabled>{{ $t('create_league.form.select_sport') }}</option>
                                        <option v-for="sport in sports" :key="sport.id" :value="sport.id">
                                            {{ sport.name }}
                                        </option>
                                    </select>
                                    <span
                                        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary-light dark:text-text-secondary-dark material-symbols-outlined">expand_more</span>
                                </div>
                            </div>

                            <div>
                                <label for="location"
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    {{ $t('create_league.form.location_label') }} <span class="text-red-500">*</span>
                                </label>
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">location_on</span>
                                    <input v-model="formData.location" type="text" id="location" required
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        :placeholder="$t('create_league.form.location_placeholder')" />
                                </div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label for="description"
                                class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                {{ $t('create_league.form.description_label') }}
                            </label>
                            <textarea v-model="formData.description" id="description" rows="4"
                                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none"
                                :placeholder="$t('create_league.form.description_placeholder')"></textarea>
                        </div>

                        <!-- Logo & Cover Selection -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            <!-- Logo -->
                            <div>
                                <ImageUpload ref="logoUpload" v-model="formData.logo"
                                    :label="$t('create_league.form.logo_label')" circle
                                    @preview="url => previewLogo = url" />

                            </div>

                            <!-- Cover Photo -->
                            <div>
                                <ImageUpload ref="coverUpload" v-model="formData.cover_photo"
                                    :label="$t('create_league.form.cover_label')"
                                    @preview="url => previewCover = url" />
                            </div>
                        </div>

                        <!-- Advanced Settings -->
                        <div class="pt-6 border-t border-border-light dark:border-border-dark">
                            <h3
                                class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary-500">settings</span>
                                {{ $t('create_league.form.rules_title') }}
                            </h3>

                            <!-- Dynamic Settings Based on Sport -->
                            <!-- Universal Settings -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.duration_label') }}
                                    </label>
                                    <input v-model.number="formData.settings.match_duration" type="number"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 font-medium" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.players_per_team_label') }}
                                    </label>
                                    <input v-model.number="formData.settings.players_per_team" type="number"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 font-medium" />
                                </div>
                            </div>

                            <!-- Soccer / Points Based -->
                            <div v-if="!selectedSportName || selectedSportName.match(/fútbol|soccer|fussball|futebol/i)"
                                class="mt-4">
                                <label
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    {{ $t('create_league.form.points_table_label') }}
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">{{ $t('create_league.form.points_win') }}</span>
                                        <input v-model.number="formData.settings.points_win" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 text-center" />
                                    </div>
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">{{ $t('create_league.form.points_draw') }}</span>
                                        <input v-model.number="formData.settings.points_draw" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 text-center" />
                                    </div>
                                    <div>
                                        <span
                                            class="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">{{ $t('create_league.form.points_loss') }}</span>
                                        <input v-model.number="formData.settings.points_loss" type="number"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-2 px-3 text-center" />
                                    </div>
                                </div>
                            </div>

                            <!-- Tennis / Padel -->
                            <div v-if="selectedSportName && selectedSportName.match(/tenis|tênis|tennis|pádel|padel/i)"
                                class="mt-4 grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.sets_to_win_label') }}
                                    </label>
                                    <select v-model="formData.settings.sets_to_win"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none">
                                        <option :value="1">{{ $t('create_league.form.sets_options.1') }}</option>
                                        <option :value="2">{{ $t('create_league.form.sets_options.2') }}</option>
                                        <option :value="3">{{ $t('create_league.form.sets_options.3') }}</option>
                                    </select>
                                </div>

                                <div v-if="selectedSportName.match(/pádel|padel/i)">
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.golden_point_label') }}
                                    </label>
                                    <div class="flex items-center gap-3 py-3">
                                        <input type="checkbox" v-model="formData.settings.golden_point"
                                            class="w-5 h-5 accent-primary-500 rounded" />
                                        <span
                                            class="text-sm text-text-secondary-light dark:text-text-secondary-dark">{{ $t('create_league.form.golden_point_active') }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Basketball -->
                            <div v-if="selectedSportName && selectedSportName.match(/baloncesto|basket|basquete/i)"
                                class="mt-4 grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.period_length_label') }}
                                    </label>
                                    <input v-model.number="formData.settings.period_length" type="number"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none"
                                        placeholder="10" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.foul_limit_label') }}
                                    </label>
                                    <input v-model.number="formData.settings.foul_limit" type="number"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none"
                                        placeholder="5" />
                                </div>
                            </div>

                            <!-- Volleyball -->
                            <div v-if="selectedSportName && selectedSportName.match(/voleibol|voley|volleyball|vôlei/i)"
                                class="mt-4 grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.points_per_set_label') }}
                                    </label>
                                    <input v-model.number="formData.settings.max_points_set" type="number"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none"
                                        placeholder="25" />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('create_league.form.sets_to_win_label') }}
                                    </label>
                                    <select v-model="formData.settings.sets_to_win"
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none">
                                        <option :value="2">{{ $t('create_league.form.sets_options.2') }}</option>
                                        <option :value="3">{{ $t('create_league.form.sets_options.3') }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div
                            class="pt-6 flex items-center justify-end gap-4 border-t border-border-light dark:border-border-dark">
                            <button type="button" @click="router.back()"
                                class="px-6 py-3 rounded-xl font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                {{ $t('create_league.form.cancel') }}
                            </button>
                            <button type="submit" :disabled="loading"
                                class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="loading"
                                    class="material-symbols-outlined animate-spin">progress_activity</span>
                                <span>{{ loading ? $t('create_league.form.creating') : $t('create_league.form.submit') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Preview Column -->
            <div class="lg:col-span-1 animate-slide-up stagger-1">
                <div class="sticky top-24">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">visibility</span>
                        {{ $t('create_league.preview.title') }}
                    </h3>

                    <!-- League Card Preview -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
                        <!-- Cover/Header -->
                        <div
                            class="h-24 md:h-32 bg-gradient-to-br from-primary-600 to-primary-900 relative overflow-hidden">
                            <img v-if="previewCover || formData.cover_photo" :src="previewCover || formData.cover_photo"
                                class="absolute inset-0 w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/20"></div>
                            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                            <div class="absolute bottom-0 left-0 w-full p-4 flex items-end gap-4 translate-y-1/2">
                                <div class="w-20 h-20 rounded-2xl bg-surface-light dark:bg-surface-dark p-1 shadow-lg">
                                    <img :src="previewLogo || formData.logo || 'https://ui-avatars.com/api/?name=Liga&background=random'"
                                        class="w-full h-full object-cover rounded-xl bg-gray-100 dark:bg-white/5"
                                        @error="handleImageError" />
                                </div>
                            </div>
                        </div>

                        <div class="pt-8 md:pt-12 px-5 pb-5 md:px-6 md:pb-6">
                            <div class="mb-4">
                                <h3
                                    class="text-xl font-display font-bold text-text-primary-light dark:text-white leading-tight mb-1">
                                    {{ formData.name || $t('create_league.preview.name_placeholder') }}
                                </h3>
                                <div
                                    class="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                    <span class="material-symbols-outlined text-base">location_on</span>
                                    {{ formData.location || $t('create_league.preview.location_placeholder') }}
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-500/20">
                                    {{ getSportName(formData.sport_id) }}
                                </span>
                                <span
                                    class="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20">
                                    {{ $t('create_league.preview.status_active') }}
                                </span>
                            </div>

                            <p
                                class="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-3 mb-4">
                                {{ formData.description || $t('create_league.preview.description_placeholder') }}
                            </p>

                            <div
                                class="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                                <div class="flex -space-x-2">
                                    <div v-for="i in 3" :key="i"
                                        class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                                        {{ i }}
                                    </div>
                                </div>
                                <span
                                    class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">0
                                    {{ $t('create_league.preview.teams') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tips Card -->
                    <div class="mt-6 bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                        <div class="flex gap-3">
                            <span class="material-symbols-outlined text-blue-500">lightbulb</span>
                            <div>
                                <h4 class="font-bold text-blue-600 dark:text-blue-400 text-sm mb-1">
                                    {{ $t('create_league.tips.title') }}
                                </h4>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    {{ $t('create_league.tips.message') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const { $api } = useNuxtApp()
const toastStore = useToastStore()

const loading = ref(false)
const sports = ref<{ id: number; name: string }[]>([])
const logoUpload = ref()
const coverUpload = ref()
const previewLogo = ref<string | null>(null)
const previewCover = ref<string | null>(null)

interface LeagueSettings {
    match_duration: number | null;
    players_per_team: number | null;
    points_win: number;
    points_draw: number;
    points_loss: number;
    sets_to_win?: number;
    tie_break_rule?: string;
    golden_point?: boolean;
    period_length?: number;
    foul_limit?: number;
    rally_scoring?: boolean;
    max_points_set?: number;
}

const formData = ref<{
    name: string;
    description: string;
    sport_id: string | number;
    location: string;
    logo: string;
    cover_photo: string;
    settings: LeagueSettings;
}>({
    name: '',
    description: '',
    sport_id: '',
    location: '',
    logo: '',
    cover_photo: '',
    settings: {
        match_duration: null,
        players_per_team: null,
        points_win: 3,
        points_draw: 1,
        points_loss: 0,
        // Advanced Sport Settings
        sets_to_win: 2, // Tennis/Volleyball
        tie_break_rule: 'standard', // Tennis
        golden_point: false, // Padel
        period_length: 10, // Basketball
        foul_limit: 5, // Basketball
        rally_scoring: true, // Volleyball
        max_points_set: 25 // Volleyball
    }
})

const selectedSportName = computed(() => {
    const s = sports.value.find(sp => sp.id == formData.value.sport_id)
    return s ? s.name : ''
})

/* Set defaults when sport changes */
import { watch } from 'vue'
watch(() => formData.value.sport_id, (newId) => {
    const sport = sports.value.find(s => s.id == newId)
    if (!sport) return

    const name = sport.name.toLowerCase()

    // Reset specific defaults
    if (/fútbol|soccer|fussball|futebol/i.test(name)) {
        formData.value.settings.points_win = 3
        formData.value.settings.points_draw = 1
        formData.value.settings.match_duration = name.includes('7') ? 50 : 90
        formData.value.settings.players_per_team = name.includes('7') ? 7 : 11
    } else if (/baloncesto|basket|basquete/i.test(name)) {
        formData.value.settings.points_win = 2 // FIBA
        formData.value.settings.points_loss = 1
        formData.value.settings.match_duration = 40
        formData.value.settings.players_per_team = 5
    } else if (/tenis|tênis|tennis|pádel|padel/i.test(name)) {
        formData.value.settings.sets_to_win = 2
        formData.value.settings.players_per_team = /pádel|padel/i.test(name) ? 2 : 1
    } else if (/voleibol|voley|volleyball|vôlei/i.test(name)) {
        formData.value.settings.sets_to_win = 3
        formData.value.settings.match_duration = 60 // Approx
        formData.value.settings.players_per_team = 6
    }
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
        toastStore.error(t('create_league.form.error_loading_sports'))
    }
})

const getSportName = (id: string | number) => {
    if (!id) return t('create_league.form.sport_label')
    const sport = sports.value.find(s => s.id == id)
    return sport ? sport.name : t('create_league.form.sport_label')
}

const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement
    const fallbackUrl = 'https://ui-avatars.com/api/?name=Liga&background=random'

    if (target.src !== fallbackUrl) {
        target.src = fallbackUrl
    }
}

const handleSubmit = async () => {
    loading.value = true
    try {
        // Upload images first
        if (logoUpload.value) {
            const logoUrl = await logoUpload.value.upload()
            if (logoUrl) formData.value.logo = logoUrl
        }

        if (coverUpload.value) {
            const coverUrl = await coverUpload.value.upload()
            if (coverUrl) formData.value.cover_photo = coverUrl
        }

        const response = await $api.post('/leagues', formData.value)

        if (response.data.success) {
            toastStore.success(response.data.message)
            // Redirect to leagues list or the new league details
            router.push('/leagues')
        }
    } catch (error: any) {
        const msg = error.response?.data?.message || t('create_league.form.error_creating')
        toastStore.error(msg)
    } finally {
        loading.value = false
    }
}

definePageMeta({
    middleware: ['auth']
})
</script>
