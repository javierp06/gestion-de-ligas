<template>
    <div v-if="canManage" class="w-full max-w-4xl mx-auto mb-8 animate-fade-in-up px-4">
        <!-- Main Control Deck -->
        <div
            class="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/60 shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-black/5">

            <!-- Live Status Strip -->
            <div v-if="match.status === 'live'"
                class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 animate-pulse-fast z-10">
            </div>

            <div class="p-3 md:p-8">
                <!-- Header -->
                <div class="flex items-center justify-between mb-4 md:mb-8">
                    <div class="flex items-center gap-2 md:gap-3">
                        <div
                            class="p-1.5 md:p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                            <span class="material-symbols-outlined text-xl md:text-2xl">settings_remote</span>
                        </div>
                        <div>
                            <h3 class="text-base md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                {{ $t('match_details.live_controls.title') }}
                            </h3>
                            <p
                                class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                                ORGANIZER CONSOLE
                            </p>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div
                        class="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                        <div class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-[0_0_10px_currentColor]"
                            :class="statusColorClass">
                        </div>
                        <span
                            class="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                            {{ $t('match_details.status.' + match.status) }}
                        </span>
                    </div>
                </div>

                <!-- Controls Grid -->
                <!-- Scenario 1: Pre-Match (Start) -->
                <div v-if="match.status === 'scheduled' || match.status === 'postponed'"
                    class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <button @click="updateStatus('live')"
                        class="group relative overflow-hidden p-4 md:p-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1">
                        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        </div>
                        <div class="relative z-10 flex flex-col items-center gap-2 md:gap-3">
                            <div class="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm">
                                <span class="material-symbols-outlined text-3xl md:text-4xl">play_arrow</span>
                            </div>
                            <div class="text-center">
                                <span
                                    class="block font-black text-lg md:text-xl tracking-tight">{{ $t('match_details.live_controls.start') }}</span>
                                <span class="text-primary-100 text-xs md:text-sm">Kick-off the match now</span>
                            </div>
                        </div>
                    </button>

                    <button @click="updateStatus('cancelled')"
                        class="group p-4 md:p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-2xl md:text-3xl">block</span>
                        <span
                            class="font-bold text-xs md:text-sm uppercase tracking-wide">{{ $t('match_details.live_controls.cancel') }}</span>
                    </button>
                </div>

                <!-- Scenario 2: Live Match -->
                <div v-if="match.status === 'live'" class="space-y-4 md:space-y-6">
                    <!-- Goal Controls -->
                    <div class="grid grid-cols-2 gap-3 md:gap-8">
                        <!-- Home Team -->
                        <button @click="openGoalModal('home')"
                            class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border-2 border-primary-100 dark:border-primary-900/30 hover:border-primary-500 dark:hover:border-primary-500 shadow-sm hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 p-3 md:p-6 text-left">
                            <div
                                class="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all text-primary-500">
                                <span class="material-symbols-outlined text-6xl md:text-9xl">sports_soccer</span>
                            </div>
                            <div class="relative z-10">
                                <span
                                    class="block text-[10px] md:text-xs font-bold text-primary-500 uppercase tracking-widest mb-0.5 md:mb-1">GOAL
                                    FOR</span>
                                <span
                                    class="block text-sm md:text-2xl font-black text-gray-900 dark:text-white truncate mb-1 md:mb-2">{{ match.home_team_name }}</span>
                                <div
                                    class="inline-flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-primary-500 text-white font-bold text-xs md:text-sm shadow-md group-hover:bg-primary-600 transition-colors">
                                    <span class="material-symbols-outlined text-base md:text-lg">add</span>
                                    1 GOAL
                                </div>
                            </div>
                        </button>

                        <!-- Away Team -->
                        <button @click="openGoalModal('away')"
                            class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 p-3 md:p-6 text-left">
                            <div
                                class="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all text-blue-500">
                                <span class="material-symbols-outlined text-6xl md:text-9xl">sports_soccer</span>
                            </div>
                            <div class="relative z-10">
                                <span
                                    class="block text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest mb-0.5 md:mb-1">GOAL
                                    FOR</span>
                                <span
                                    class="block text-sm md:text-2xl font-black text-gray-900 dark:text-white truncate mb-1 md:mb-2">{{ match.away_team_name }}</span>
                                <div
                                    class="inline-flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-blue-500 text-white font-bold text-xs md:text-sm shadow-md group-hover:bg-blue-600 transition-colors">
                                    <span class="material-symbols-outlined text-base md:text-lg">add</span>
                                    1 GOAL
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Match Management Actions -->
                    <!-- Match Management Actions (Dropdown) -->
                    <div class="relative z-20">
                        <button @click="showStatusMenu = !showStatusMenu"
                            class="w-full flex items-center justify-between p-4 rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-bold hover:bg-black dark:hover:bg-gray-600 shadow-lg transition-all text-base group">
                            <div class="flex items-center gap-3">
                                <span
                                    class="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">settings_power</span>
                                <span>{{ $t('match_details.live_controls.start') === 'Start Match' ? 'Match Actions' : 'Opciones de Partido' }}</span>
                            </div>
                            <span class="material-symbols-outlined transition-transform duration-300"
                                :class="{ 'rotate-180': showStatusMenu }">expand_more</span>
                        </button>

                        <div v-if="showStatusMenu"
                            class="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up origin-bottom">

                            <!-- Half Time -->
                            <button @click="updateStatus('half_time'); showStatusMenu = false"
                                class="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-700 text-left">
                                <span class="material-symbols-outlined text-blue-500">hourglass_top</span>
                                <div>
                                    <span
                                        class="block font-bold text-gray-900 dark:text-white">{{ $t('match_details.status.half_time') }}</span>
                                    <span class="text-xs text-gray-500">Intervalo / Descanso</span>
                                </div>
                            </button>

                            <!-- Suspend -->
                            <button @click="updateStatus('postponed'); showStatusMenu = false"
                                class="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-700 text-left">
                                <span class="material-symbols-outlined text-orange-500">pause_circle</span>
                                <div>
                                    <span
                                        class="block font-bold text-gray-900 dark:text-white">{{ $t('match_details.live_controls.suspend') }}</span>
                                    <span class="text-xs text-gray-500">Pausar temporalmente</span>
                                </div>
                            </button>

                            <!-- Finish -->
                            <button @click="confirmFinish(); showStatusMenu = false"
                                class="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group">
                                <span
                                    class="material-symbols-outlined text-red-500 group-hover:scale-110 transition-transform">flag</span>
                                <div>
                                    <span
                                        class="block font-bold text-red-600 dark:text-red-400">{{ $t('match_details.live_controls.finish') }}</span>
                                    <span class="text-xs text-red-400/80">Finalizar encuentro</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <!-- Touch Backdrop for Menu -->
                    <div v-if="showStatusMenu" @click="showStatusMenu = false"
                        class="fixed inset-0 z-10 cursor-default bg-transparent"></div>
                </div>

                <!-- Scenario 3: Finished -->
                <div v-if="match.status === 'finished'" class="text-center py-6">
                    <div
                        class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold border border-green-200 dark:border-green-800 mb-6">
                        <span class="material-symbols-outlined">check_circle</span>
                        Match Completed
                    </div>

                    <div>
                        <button @click="updateStatus('live')"
                            class="text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-4 decoration-dashed">
                            {{ $t('match_details.live_controls.reopen') }}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- Goal Scorer Modal -->
        <div v-if="showGoalModal"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
                <div class="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 text-white">
                    <h3 class="font-bold text-lg flex items-center gap-2">
                        <span class="material-symbols-outlined text-green-400">sports_soccer</span>
                        Who Scored?
                    </h3>
                    <button @click="closeGoalModal" class="p-1 rounded hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div class="p-6">
                    <p class="text-sm text-gray-500 mb-4 font-medium dark:text-gray-400">Select the player who scored
                        for {{ scoringTeamName }}:</p>

                    <div class="max-h-64 overflow-y-auto space-y-2 pr-2">
                        <!-- Quick option: Just Team (Unknown Player) -->
                        <button @click="confirmGoal(null)"
                            class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-500 transition-all text-left group">
                            <div
                                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span
                                    class="material-symbols-outlined text-gray-500 group-hover:text-primary-500">groups</span>
                            </div>
                            <span class="font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary-500">Team
                                Goal (Unknown Player)</span>
                        </button>

                        <button v-for="player in scoringTeamPlayers" :key="player.id" @click="confirmGoal(player)"
                            class="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-green-50 dark:hover:bg-green-900/20 border border-transparent hover:border-green-500 transition-all text-left group">
                            <div
                                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                <img v-if="player.photo" :src="player.photo" class="w-full h-full object-cover">
                                <span v-else
                                    class="text-xs font-bold">{{ (player.name || '?').substring(0, 2).toUpperCase() }}</span>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <span
                                        class="font-bold text-gray-700 dark:text-gray-200 group-hover:text-green-500">{{ player.name }}</span>
                                    <span v-if="player.number"
                                        class="text-xs bg-black/20 px-1.5 rounded text-gray-500 dark:text-gray-400">#{{
                                            player.number }}</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="p-4 bg-gray-50 dark:bg-black/20 text-center border-t border-gray-200 dark:border-white/5">
                    <button @click="closeGoalModal"
                        class="text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        <!-- Finish Match Confirmation Modal -->
        <div v-if="showFinishConfirm"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-zoom-in border border-white/10">
                <div class="p-6 text-center">
                    <div
                        class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4 text-red-500">
                        <span class="material-symbols-outlined text-3xl">flag</span>
                    </div>
                    <h3 class="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        {{ $t('match_details.live_controls.finish') }}?
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                        {{ $t('match_details.live_controls.confirm_finish') }}
                    </p>

                    <div class="grid grid-cols-2 gap-3">
                        <button @click="showFinishConfirm = false"
                            class="px-4 py-3 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {{ $t('table.cancel') }}
                        </button>
                        <button @click="executeFinish"
                            class="px-4 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all">
                            {{ $t('match_details.live_controls.finish') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNuxtApp } from '#app'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
    match: any
}>()

const emit = defineEmits(['updated'])

const { $api } = useNuxtApp()
const toastStore = useToastStore()
const { t } = useI18n()
const authStore = useAuthStore()

// Goal Modal State
const showGoalModal = ref(false)
const scoringTeam = ref<'home' | 'away' | null>(null)

const canManage = computed(() => {
    return authStore.isAdmin || authStore.isOrganizer
})

const statusColorClass = computed(() => {
    const map: Record<string, string> = {
        'scheduled': 'bg-blue-500 text-blue-500',
        'live': 'bg-red-500 text-red-500 animate-pulse',
        'finished': 'bg-green-500 text-green-500',
        'postponed': 'bg-orange-500 text-orange-500',
        'cancelled': 'bg-gray-500 text-gray-500'
    }
    return map[props.match.status] || 'bg-gray-400'
})

const scoringTeamName = computed(() => {
    if (scoringTeam.value === 'home') return props.match.home_team_name
    if (scoringTeam.value === 'away') return props.match.away_team_name
    return ''
})

const scoringTeamPlayers = computed(() => {
    if (scoringTeam.value === 'home' && props.match.home_roster) return props.match.home_roster
    if (scoringTeam.value === 'away' && props.match.away_roster) return props.match.away_roster

    if (!props.match.player_stats) return []
    const teamName = scoringTeamName.value
    // Filter active players for that team
    return props.match.player_stats.filter((p: any) => p.team_name === teamName)
})

const openGoalModal = (team: 'home' | 'away') => {
    scoringTeam.value = team
    showGoalModal.value = true
}

const closeGoalModal = () => {
    showGoalModal.value = false
    scoringTeam.value = null
}

const confirmGoal = async (player: any | null) => {
    if (!scoringTeam.value) return

    try {
        // 1. Update Match Score
        const team = scoringTeam.value
        const delta = 1
        const newHome = team === 'home' ? (props.match.home_score || 0) + delta : (props.match.home_score || 0)
        const newAway = team === 'away' ? (props.match.away_score || 0) + delta : (props.match.away_score || 0)

        // API 1: Update Score (sets status live if needed implicitly, but we keep it live)
        await $api.patch(`/matches/${props.match.id}/score`, {
            home_score: newHome,
            away_score: newAway
        })

        // 2. Update Player Stats (if player selected)
        if (player) {
            // We need to construct the FULL stats array to save back, 
            // OR ideally we should have an endpoint just to ADD an event. 
            // But for now we must save the whole array of stats + the new one.
            // CAUTION: This overwrites everyone else's stats if we don't include them.
            // Using props.match.player_stats gives us the CURRENT state. We modify it.

            const currentStats = props.match.player_stats ? [...props.match.player_stats] : []
            // Determine Player ID (roster has .id, existing stats have .player_id)
            const playerId = player.id || player.player_id
            const statsIndex = currentStats.findIndex((p: any) => p.player_id === playerId)

            if (statsIndex !== -1) {
                currentStats[statsIndex].goals = (currentStats[statsIndex].goals || 0) + 1
            } else {
                // Initialize stats for new player
                currentStats.push({
                    player_id: playerId,
                    goals: 1,
                    assists: 0,
                    yellow_cards: 0,
                    red_cards: 0,
                    minutes_played: 0
                })
            }

            // Map to payload format expected by updatePlayerStats
            const payload = currentStats.map((p: any) => ({
                player_id: p.player_id,
                goals: p.goals,
                assists: p.assists,
                yellow_cards: p.yellow_cards,
                red_cards: p.red_cards,
                minutes_played: p.minutes_played
            }))

            await $api.post(`/matches/${props.match.id}/stats`, {
                stats: payload
            })

            toastStore.success(`Goal added for ${player.name}!`)
        } else {
            toastStore.success(t('match_details.live_controls.score_updated'))
        }

        emit('updated')
        closeGoalModal()

    } catch (error: any) {
        toastStore.error(error.response?.data?.message || 'Error updating goal')
    }
}

const updateStatus = async (newStatus: string) => {
    try {
        await $api.put(`/matches/${props.match.id}`, {
            status: newStatus
        })
        toastStore.success(t(`match_details.live_controls.status_updated`, { status: t(`match_details.status.${newStatus}`) }))
        emit('updated')
    } catch (error: any) {
        toastStore.error(error.response?.data?.message || 'Error updating status')
    }
}

const updateScoreLegacy = async (team: 'home' | 'away', delta: number) => {
    // Kept for reference but replaced by modal flow
    // ...
}

const showFinishConfirm = ref(false)
const showStatusMenu = ref(false)

const confirmFinish = () => {
    showFinishConfirm.value = true
}

const executeFinish = () => {
    updateStatus('finished')
    showFinishConfirm.value = false
}
</script>

<style scoped>
.animate-pulse-fast {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
