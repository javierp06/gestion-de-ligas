<template>
    <div class="relative w-full max-w-4xl mx-auto bg-green-800 rounded-xl overflow-hidden shadow-xl p-4 md:p-8">
        <!-- Field Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 opacity-90"></div>

        <!-- Field Markings -->
        <div class="absolute inset-4 border-2 border-white/30 rounded-lg"></div> <!-- Pitch Outline -->
        <div class="absolute top-1/2 left-4 right-4 h-px bg-white/30 -translate-y-1/2"></div> <!-- Halfway Line -->
        <div
            class="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white/30 -translate-x-1/2 -translate-y-1/2">
        </div> <!-- Center Circle -->

        <!-- Penalty Areas (Top - Guest) -->
        <div
            class="absolute top-4 left-1/2 w-48 h-24 border-2 border-t-0 border-white/30 -translate-x-1/2 rounded-b-lg">
        </div>
        <!-- Penalty Areas (Bottom - Home) -->
        <div
            class="absolute bottom-4 left-1/2 w-48 h-24 border-2 border-b-0 border-white/30 -translate-x-1/2 rounded-t-lg">
        </div>


        <!-- Content Layer -->
        <div class="relative z-10 flex flex-col md:flex-row h-[550px] md:h-[700px]">

            <!-- Home Team (Bottom Half in Mobile, Left in Desktop if side-by-side but usually bottom-up) -->
            <!-- Layout: Top Half = Away Team, Bottom Half = Home Team -->

            <!-- Away Team Formation (Top Half) -->
            <div class="absolute top-0 left-0 w-full h-1/2 p-2 md:p-4">
                <div class="w-full h-full relative">
                    <div
                        class="absolute top-0 left-1/2 -translate-x-1/2 text-white/80 font-bold text-xs md:text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm z-30 whitespace-nowrap">
                        {{ awayTeamName }} ({{ getFormation(awayPlayers) }})
                    </div>

                    <template v-for="player in getLineup(awayPlayers)" :key="player.id">
                        <div class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all hover:scale-110 hover:z-20"
                            :style="{ left: `${player.x}%`, top: `${player.y}%` }">

                            <!-- Rating Badge (Mock) -->
                            <div v-if="player.rating"
                                class="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-orange-500 text-white text-[8px] md:text-[10px] font-bold px-1 md:px-1.5 rounded-full shadow-sm z-10">
                                {{ player.rating }}
                            </div>

                            <!-- Avatar -->
                            <div
                                class="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white bg-gray-800 overflow-hidden shadow-lg relative transition-all group-hover:border-primary-400">
                                <img v-if="player.photo" :src="player.photo" class="w-full h-full object-cover">
                                <div v-else
                                    class="w-full h-full flex items-center justify-center bg-gray-700 text-white font-bold text-[10px] md:text-xs">
                                    {{ getInitials(player.name) }}
                                </div>
                            </div>

                            <!-- Name & Number -->
                            <div class="mt-0.5 md:mt-1 flex flex-col items-center">
                                <span
                                    class="text-white text-[9px] md:text-xs font-bold leading-tight drop-shadow-md text-center bg-black/30 px-1 md:px-1.5 rounded truncate max-w-[60px] md:max-w-none">
                                    {{ (player.name || '?').split(' ').pop() }}
                                </span>
                                <span class="text-white/80 text-[8px] md:text-[10px] drop-shadow-md">
                                    {{ player.number || '-' }}
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Home Team Formation (Bottom Half) -->
            <div class="absolute bottom-0 left-0 w-full h-1/2 p-2 md:p-4">
                <div class="w-full h-full relative">
                    <div
                        class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/80 font-bold text-xs md:text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm z-30 whitespace-nowrap">
                        {{ homeTeamName }} ({{ getFormation(homePlayers) }})
                    </div>

                    <template v-for="player in getLineup(homePlayers)" :key="player.id">
                        <div class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all hover:scale-110 hover:z-20"
                            :style="{ left: `${player.x}%`, bottom: `${player.y}%` }">
                            <!-- Note: Bottom positioning for home -->

                            <!-- Rating Badge -->
                            <div v-if="player.rating"
                                class="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-orange-500 text-white text-[8px] md:text-[10px] font-bold px-1 md:px-1.5 rounded-full shadow-sm z-10">
                                {{ player.rating }}
                            </div>

                            <!-- Avatar -->
                            <div
                                class="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white bg-gray-800 overflow-hidden shadow-lg relative transition-all group-hover:border-primary-400">
                                <img v-if="player.photo" :src="player.photo" class="w-full h-full object-cover">
                                <div v-else
                                    class="w-full h-full flex items-center justify-center bg-blue-900 text-white font-bold text-[10px] md:text-xs">
                                    {{ getInitials(player.name) }}
                                </div>
                            </div>

                            <!-- Name & Number -->
                            <div class="mt-0.5 md:mt-1 flex flex-col items-center">
                                <span
                                    class="text-white text-[9px] md:text-xs font-bold leading-tight drop-shadow-md text-center bg-black/30 px-1 md:px-1.5 rounded truncate max-w-[60px] md:max-w-none">
                                    {{ (player.name || '?').split(' ').pop() }}
                                </span>
                                <span class="text-white/80 text-[8px] md:text-[10px] drop-shadow-md">
                                    {{ player.number || '-' }}
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    homePlayers: any[],
    awayPlayers: any[],
    homeTeamName: string,
    awayTeamName: string
}>()

const getInitials = (name: string) => {
    return (name || '?').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

// Logic to distribute players on the field
const getLineup = (players: any[]) => {
    // 1. Filter selected players
    // Since props.players comes from match.player_stats which only contains DB records, take all of them.
    const selected = players;

    // Group by position
    const gk = selected.filter(p => p.position === 'Portero' || p.position === 'Goalkeeper')
    const def = selected.filter(p => p.position === 'Defensa' || p.position === 'Defender')
    const mid = selected.filter(p => p.position === 'Mediocampista' || p.position === 'Midfielder')
    const fwd = selected.filter(p => p.position === 'Delantero' || p.position === 'Forward')
    const unknown = selected.filter(p => !gk.includes(p) && !def.includes(p) && !mid.includes(p) && !fwd.includes(p))

    // Assign Coordinates (x, y in %)
    // Y is relative to their half (Start form goal line = 0 to center line = 100)

    // Helper to distribute a row horizontally
    const distributeRow = (rowPlayers: any[], baseY: number) => {
        const count = rowPlayers.length
        return rowPlayers.map((p, index) => ({
            ...p,
            y: baseY,
            x: count === 1 ? 50 : (100 / (count + 1)) * (index + 1)
        }))
    }

    const mappedGK = distributeRow(gk.length ? gk : (unknown.length ? [unknown.shift()] : []), 10)
    const mappedDEF = distributeRow(def.length ? def : unknown.splice(0, 4), 30) // Fallback logic roughly
    const mappedMID = distributeRow(mid.length ? mid : unknown.splice(0, 4), 55)
    // Forwards closer to center line (which is top of this container)
    const mappedFWD = distributeRow(fwd.length ? fwd : unknown, 80)

    return [...mappedGK, ...mappedDEF, ...mappedMID, ...mappedFWD]
}

const getFormation = (players: any[]) => {
    // 1. Filter selected
    const selected = players;

    // Count per line (excluding GK usually)
    const def = selected.filter(p => p.position === 'Defensa' || p.position === 'Defender').length
    const mid = selected.filter(p => p.position === 'Mediocampista' || p.position === 'Midfielder').length
    const fwd = selected.filter(p => p.position === 'Delantero' || p.position === 'Forward').length

    if (def + mid + fwd === 0) return '?'
    return `${def}-${mid}-${fwd}`
}

</script>

<style scoped>
/* Add any specific transitions if needed */
</style>
