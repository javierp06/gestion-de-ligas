<template>
    <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')">
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col animate-scale-up">
            <!-- Header -->
            <div
                class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg shrink-0">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary-500">leaderboard</span>
                    {{ $t('match_details.modals.stats.title') }}
                </h2>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-hidden flex flex-col">
                <!-- Tabs -->
                <div class="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <button @click="activeTeam = 'home'"
                        class="flex-1 py-3 font-bold text-sm border-b-2 transition-colors flex items-center justify-center gap-2"
                        :class="activeTeam === 'home' ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'">
                        <img v-if="match.home_team_logo" :src="match.home_team_logo" class="w-6 h-6 object-contain">
                        {{ match.home_team_name }}
                    </button>
                    <button @click="activeTeam = 'away'"
                        class="flex-1 py-3 font-bold text-sm border-b-2 transition-colors flex items-center justify-center gap-2"
                        :class="activeTeam === 'away' ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'">
                        <img v-if="match.away_team_logo" :src="match.away_team_logo" class="w-6 h-6 object-contain">
                        {{ match.away_team_name }}
                    </button>
                </div>

                <!-- Players List -->
                <div class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
                    <div v-if="loadingPlayers" class="flex justify-center py-12">
                        <span
                            class="material-symbols-outlined animate-spin text-4xl text-primary-500">progress_activity</span>
                    </div>

                    <div v-else class="space-y-2">
                        <!-- Header Row (Desktop Only) -->
                        <div
                            class="hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2 text-center">
                            <div class="col-span-1" :title="$t('match_details.stats.lineup')">
                                <span class="material-symbols-outlined text-base">group_add</span>
                            </div>
                            <div class="col-span-3 text-left">{{ $t('match_details.player') }}</div>
                            <div class="col-span-2">{{ $t('match_details.stats.goals') }}</div>
                            <div class="col-span-2">{{ $t('match_details.stats.assists') }}</div>
                            <div class="col-span-2" :title="$t('match_details.stats.yellow_cards')">TA</div>
                            <div class="col-span-2" :title="$t('match_details.stats.red_cards')">TR</div>
                        </div>

                        <div v-for="player in currentTeamPlayers" :key="player.id"
                            class="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500/30 transition-colors"
                            :class="{ 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-500/30': player.selected }">

                            <!-- Identity (Checkbox + Name) -->
                            <div class="w-full md:col-span-4 flex items-center gap-3">
                                <!-- Selection Checkbox -->
                                <div class="flex-shrink-0">
                                    <input type="checkbox" v-model="player.selected"
                                        class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer">
                                </div>

                                <!-- Player Info -->
                                <div class="flex items-center gap-3 min-w-0 flex-1"
                                    :class="{ 'opacity-50': !player.selected }">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                        {{ player.jersey_number || '#' }}
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="font-bold text-gray-900 dark:text-white truncate text-sm">
                                            {{ player.player_name }}
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {{ player.position || $t('match_details.player') }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Mobile Stats Labels (Hidden on Desktop) -->
                            <!-- We will use a grid for the inputs area -->
                            <div class="w-full md:col-span-8 grid grid-cols-4 md:grid-cols-8 gap-2">

                                <!-- Goals -->
                                <div class="md:col-span-2">
                                    <label
                                        class="block md:hidden text-[10px] text-gray-500 text-center uppercase font-bold mb-1">{{ $t('match_details.stats.goals_short') || 'G' }}</label>
                                    <input type="number" min="0" v-model.number="player.stats.goals"
                                        :disabled="!player.selected"
                                        class="w-full text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm font-bold focus:ring-2 focus:ring-primary-500 disabled:opacity-30"
                                        placeholder="0">
                                </div>

                                <!-- Assists -->
                                <div class="md:col-span-2">
                                    <label
                                        class="block md:hidden text-[10px] text-gray-500 text-center uppercase font-bold mb-1">{{ $t('match_details.stats.assists_short') || 'A' }}</label>
                                    <input type="number" min="0" v-model.number="player.stats.assists"
                                        :disabled="!player.selected"
                                        class="w-full text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm font-bold focus:ring-2 focus:ring-primary-500 disabled:opacity-30"
                                        placeholder="0">
                                </div>

                                <!-- Yellow Cards -->
                                <div class="md:col-span-2">
                                    <label
                                        class="block md:hidden text-[10px] text-gray-500 text-center uppercase font-bold mb-1">TA</label>
                                    <input type="number" min="0" v-model.number="player.stats.yellow_cards"
                                        :disabled="!player.selected"
                                        class="w-full text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded p-1 text-sm font-bold text-yellow-700 dark:text-yellow-500 focus:ring-2 focus:ring-yellow-500 disabled:opacity-30"
                                        placeholder="0">
                                </div>

                                <!-- Red Cards -->
                                <div class="md:col-span-2">
                                    <label
                                        class="block md:hidden text-[10px] text-gray-500 text-center uppercase font-bold mb-1">TR</label>
                                    <input type="number" min="0" v-model.number="player.stats.red_cards"
                                        :disabled="!player.selected"
                                        class="w-full text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-1 text-sm font-bold text-red-700 dark:text-red-500 focus:ring-2 focus:ring-red-500 disabled:opacity-30"
                                        placeholder="0">
                                </div>
                            </div>
                        </div>

                        <div v-if="currentTeamPlayers.length === 0"
                            class="text-center py-8 text-gray-500 dark:text-gray-400">
                            {{ $t('match_details.modals.stats.no_players') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shrink-0 flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    <p>{{ $t('match_details.modals.stats.total_goals') }}: <span
                            class="font-bold text-gray-900 dark:text-white">{{ totalGoals }}</span></p>
                </div>
                <div class="flex gap-3">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold"
                        :disabled="saving">
                        {{ $t('match_details.modals.edit_match.cancel') }}
                    </button>
                    <button type="button" @click="saveStats"
                        class="btn-primary px-6 py-2 rounded-lg font-bold flex items-center gap-2" :disabled="saving">
                        <span v-if="saving"
                            class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        <span>{{ $t('match_details.modals.stats.save_stats') }}</span>
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const { $api } = useNuxtApp()
const toastStore = useToastStore()
const { t } = useI18n()

const props = defineProps<{
    match: any
}>()

const emit = defineEmits<{
    close: []
    updated: []
}>()

const activeTeam = ref<'home' | 'away'>('home')
const loadingPlayers = ref(true)
const saving = ref(false)

// We need to store players for both teams independently
const homePlayers = ref<any[]>([])
const awayPlayers = ref<any[]>([])

// Helper to initialize stats structure
const initStats = (player: any) => ({
    ...player,
    selected: false,
    stats: {
        goals: 0,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
        minutes_played: 90
    }
})

// Fetch all players from both teams
const fetchPlayers = async () => {
    loadingPlayers.value = true
    try {
        const [homeRes, awayRes] = await Promise.all([
            $api.get(`/teams/${props.match.home_team_id}`),
            $api.get(`/teams/${props.match.away_team_id}`)
        ])

        if (homeRes.data.success) {
            homePlayers.value = homeRes.data.data.players.map(initStats)
        }
        if (awayRes.data.success) {
            awayPlayers.value = awayRes.data.data.players.map(initStats)
        }

        // Check if we already have stats for this match and pre-fill
        if (props.match.player_stats && props.match.player_stats.length > 0) {
            applyExistingStats(props.match.player_stats)
        }

    } catch (error) {
        console.error('Error fetching players:', error)
        toastStore.error(t('match_details.modals.stats.error_loading'))
    } finally {
        loadingPlayers.value = false
    }
}

const applyExistingStats = (existingStats: any[]) => {
    existingStats.forEach(stat => {
        // Find in home
        const hPlayer = homePlayers.value.find(p => p.id === stat.player_id)
        if (hPlayer) {
            hPlayer.selected = true
            hPlayer.stats = {
                goals: stat.goals,
                assists: stat.assists,
                yellow_cards: stat.yellow_cards,
                red_cards: stat.red_cards,
                minutes_played: stat.minutes_played
            }
        }
        // Find in away
        const aPlayer = awayPlayers.value.find(p => p.id === stat.player_id)
        if (aPlayer) {
            aPlayer.selected = true
            aPlayer.stats = {
                goals: stat.goals,
                assists: stat.assists,
                yellow_cards: stat.yellow_cards,
                red_cards: stat.red_cards,
                minutes_played: stat.minutes_played
            }
        }
    })
}

onMounted(() => {
    fetchPlayers()
})

const currentTeamPlayers = computed(() => {
    return activeTeam.value === 'home' ? homePlayers.value : awayPlayers.value
})

const totalGoals = computed(() => {
    const hGoals = homePlayers.value.reduce((sum, p) => sum + (p.stats.goals || 0), 0)
    const aGoals = awayPlayers.value.reduce((sum, p) => sum + (p.stats.goals || 0), 0)
    return hGoals + aGoals
})

const saveStats = async () => {
    saving.value = true
    try {
        // Combine all players that have at least one stat > 0
        const allPlayers = [...homePlayers.value, ...awayPlayers.value]

        // Filter players who are selected
        const statsPayload = allPlayers
            .filter(p => p.selected)
            .map(p => ({
                player_id: p.id,
                goals: p.stats.goals,
                assists: p.stats.assists,
                yellow_cards: p.stats.yellow_cards,
                red_cards: p.stats.red_cards,
                minutes_played: 90 // Default for now
            }))

        await $api.post(`/matches/${props.match.id}/stats`, {
            stats: statsPayload
        })

        toastStore.success(`✅ ${t('match_details.modals.stats.success')}`)
        emit('updated')
        emit('close')

    } catch (error: any) {
        toastStore.error(error.response?.data?.message || t('match_details.modals.stats.error_loading'))
    } finally {
        saving.value = false
    }
}
</script>
