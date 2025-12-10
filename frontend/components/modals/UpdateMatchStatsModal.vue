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
                        <!-- Header Row -->
                        <div
                            class="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 mb-2 text-center">
                            <div class="col-span-4 text-left">{{ $t('match_details.player') }}</div>
                            <div class="col-span-2">{{ $t('match_details.stats.goals') }}</div>
                            <div class="col-span-2">{{ $t('match_details.stats.assists') }}</div>
                            <div class="col-span-2" :title="$t('match_details.stats.yellow_cards')">TA</div>
                            <div class="col-span-2" :title="$t('match_details.stats.red_cards')">TR</div>
                        </div>

                        <div v-for="player in currentTeamPlayers" :key="player.id"
                            class="grid grid-cols-12 gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">

                            <!-- Player Name -->
                            <div class="col-span-4 flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                    {{ player.jersey_number || '#' }}
                                </div>
                                <div class="min-w-0">
                                    <p class="font-bold text-gray-900 dark:text-white truncate text-sm">
                                        {{ player.player_name }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {{ player.position || $t('match_details.player') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Inputs -->
                            <div class="col-span-2">
                                <input type="number" min="0" v-model.number="player.stats.goals"
                                    class="w-full text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm font-bold focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div class="col-span-2">
                                <input type="number" min="0" v-model.number="player.stats.assists"
                                    class="w-full text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-1 text-sm font-bold focus:ring-2 focus:ring-primary-500">
                            </div>
                            <div class="col-span-2">
                                <input type="number" min="0" v-model.number="player.stats.yellow_cards"
                                    class="w-full text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded p-1 text-sm font-bold text-yellow-700 dark:text-yellow-500 focus:ring-2 focus:ring-yellow-500">
                            </div>
                            <div class="col-span-2">
                                <input type="number" min="0" v-model.number="player.stats.red_cards"
                                    class="w-full text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-1 text-sm font-bold text-red-700 dark:text-red-500 focus:ring-2 focus:ring-red-500">
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

        // Filter players who have any stat entry (optional, or just save everyone who played)
        // For now, let's save stats where at least one value is > 0 OR if we want to track minutes played for everyone.
        // Let's safe filter: only send stats if they have non-zero goals, assists, cards. 
        // OR better: send everyone but maybe backend filters? 
        // Backend replaces all stats for the match, so we should send EVERYONE who has relevant data.

        // Let's send entries that have at least one non-zero value
        const statsPayload = allPlayers
            .filter(p =>
                p.stats.goals > 0 ||
                p.stats.assists > 0 ||
                p.stats.yellow_cards > 0 ||
                p.stats.red_cards > 0
            )
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
