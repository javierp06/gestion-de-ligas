<template>
    <div class="overflow-x-auto pb-8 flex justify-center">
        <div class="flex items-center gap-8 min-w-max px-4">
            
            <!-- LEFT BRACKET -->
            <div class="flex gap-8 flex-row-reverse">
                <div v-for="(roundMatches, roundIndex) in leftBracket" :key="'left-'+roundIndex"
                    class="flex flex-col justify-around gap-8">
                    <div v-for="match in roundMatches" :key="match.id" class="match-card-wrapper">
                        <MatchCard :match="match" side="left" />
                    </div>
                </div>
            </div>

            <!-- CENTER (FINAL) -->
            <div class="flex flex-col items-center justify-center gap-6 mx-4">
                <div class="text-center">
                    <span class="material-symbols-outlined text-6xl text-yellow-500 drop-shadow-lg">emoji_events</span>
                    <div class="text-xs font-bold text-yellow-500 tracking-widest mt-2">CHAMPION</div>
                </div>
                
                <div v-if="finalMatch" class="transform scale-110">
                    <MatchCard :match="finalMatch" :is-final="true" />
                </div>
                <div v-else class="text-gray-500 text-sm">Final TBD</div>
            </div>

            <!-- RIGHT BRACKET -->
            <div class="flex gap-8">
                <div v-for="(roundMatches, roundIndex) in rightBracket" :key="'right-'+roundIndex"
                    class="flex flex-col justify-around gap-8">
                    <div v-for="match in roundMatches" :key="match.id" class="match-card-wrapper">
                        <MatchCard :match="match" side="right" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

interface Match {
    id: number;
    round: number;
    stage: string;
    next_match_id: number | null;
    next_match_slot: 'home' | 'away' | null;
    home_team_id: number | null;
    away_team_id: number | null;
    home_score: number | null;
    away_score: number | null;
    home_team_name: string | null;
    away_team_name: string | null;
    home_team_logo: string | null;
    away_team_logo: string | null;
    match_date: string;
    status: 'scheduled' | 'live' | 'finished' | 'postponed';
}

const props = defineProps<{
    matches: Match[];
}>();

// --- LOGIC TO SPLIT BRACKET ---

const finalMatch = computed(() => {
    if (!props.matches || props.matches.length === 0) return null;
    // Find match with stage 'final' or highest round
    return props.matches.find(m => m.stage === 'final') || 
           [...props.matches].sort((a, b) => b.round - a.round)[0];
});

const getChildren = (matchId: number) => {
    return props.matches.filter(m => m.next_match_id === matchId);
};

const buildTree = (rootId: number): Match[] => {
    const children = getChildren(rootId);
    if (children.length === 0) return [];

    let branchMatches: Match[] = [];
    
    // Recursive collection
    const traverse = (mId: number) => {
        const kids = getChildren(mId);
        kids.forEach(k => {
            branchMatches.push(k);
            traverse(k.id);
        });
    };
    
    traverse(rootId);
    return branchMatches;
};

const groupMatchesByRound = (matches: Match[]) => {
    return matches.reduce((acc, match) => {
        const r = match.round;
        if (!acc[r]) acc[r] = [];
        acc[r].push(match);
        return acc;
    }, {} as Record<number, Match[]>);
};

const leftBracket = computed(() => {
    if (!finalMatch.value) return [];
    
    // Get the Semi-Final that feeds the Home slot of Final
    const leftRoot = props.matches.find(m => m.next_match_id === finalMatch.value!.id && m.next_match_slot === 'home');
    if (!leftRoot) return [];

    const matches = [leftRoot, ...buildTree(leftRoot.id)];
    
    // Group by round
    // We want the order: [Round 1, Round 2, ... Semi]
    // So we sort by round ASC
    const grouped = groupMatchesByRound(matches);
    return Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(k => grouped[Number(k)]);
});

const rightBracket = computed(() => {
    if (!finalMatch.value) return [];

    // Get the Semi-Final that feeds the Away slot of Final
    const rightRoot = props.matches.find(m => m.next_match_id === finalMatch.value!.id && m.next_match_slot === 'away');
    if (!rightRoot) return [];

    const matches = [rightRoot, ...buildTree(rightRoot.id)];
    
    // Group by round
    // We want the order: [Round 1, Round 2, ... Semi]
    // So we sort by round ASC
    const grouped = groupMatchesByRound(matches);
    return Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(k => grouped[Number(k)]);
});

// --- SUB-COMPONENT FOR MATCH CARD ---
const MatchCard = (props: { match: Match, isFinal?: boolean, side?: 'left' | 'right' }) => {
    const { match, isFinal, side } = props;
    
    const isWinner = (teamId: number | null) => {
        if (!teamId) return false;
        if (match.status !== 'finished') return false;
        if (match.home_score !== null && match.away_score !== null) {
             if (match.home_score > match.away_score && match.home_team_id === teamId) return true;
             if (match.away_score > match.home_score && match.away_team_id === teamId) return true;
        }
        return false;
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, {month:'short', day:'numeric'});

    return h('div', { 
        class: `relative bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm w-56 overflow-hidden group hover:shadow-md transition-all ${isFinal ? 'border-yellow-500/50 shadow-yellow-500/20' : ''}` 
    }, [
        // Connector Lines
        !isFinal && side === 'left' ? h('div', { class: 'absolute top-1/2 -right-6 w-6 h-px bg-border-light dark:bg-border-dark' }) : null,
        !isFinal && side === 'right' ? h('div', { class: 'absolute top-1/2 -left-6 w-6 h-px bg-border-light dark:bg-border-dark' }) : null,

        h('div', { class: 'flex flex-col' }, [
            // Home Team
            h('div', { 
                class: `flex items-center justify-between px-3 py-2 border-b border-border-light dark:border-border-dark ${isWinner(match.home_team_id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}` 
            }, [
                h('div', { class: 'flex items-center gap-2 overflow-hidden' }, [
                    match.home_team_logo ? h('img', { src: match.home_team_logo, class: 'w-4 h-4 object-contain' }) : h('div', { class: 'w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700' }),
                    h('span', { class: `truncate text-xs font-medium ${isWinner(match.home_team_id) ? 'text-primary-600 dark:text-primary-400' : ''} ${!match.home_team_name ? 'text-gray-400 italic' : ''}` }, match.home_team_name || 'TBD')
                ]),
                h('span', { class: 'font-bold text-xs' }, match.home_score !== null ? match.home_score : '-')
            ]),
            // Away Team
            h('div', { 
                class: `flex items-center justify-between px-3 py-2 ${isWinner(match.away_team_id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}` 
            }, [
                h('div', { class: 'flex items-center gap-2 overflow-hidden' }, [
                    match.away_team_logo ? h('img', { src: match.away_team_logo, class: 'w-4 h-4 object-contain' }) : h('div', { class: 'w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700' }),
                    h('span', { class: `truncate text-xs font-medium ${isWinner(match.away_team_id) ? 'text-primary-600 dark:text-primary-400' : ''} ${!match.away_team_name ? 'text-gray-400 italic' : ''}` }, match.away_team_name || 'TBD')
                ]),
                h('span', { class: 'font-bold text-xs' }, match.away_score !== null ? match.away_score : '-')
            ])
        ]),
        // Footer
        h('div', { class: 'px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-[10px] text-text-secondary-light dark:text-text-secondary-dark flex justify-between items-center' }, [
            h('span', formatDate(match.match_date)),
            match.status === 'live' ? h('span', { class: 'text-red-500 font-bold animate-pulse' }, 'LIVE') : 
            match.status === 'finished' ? h('span', { class: 'text-green-500 font-bold' }, 'FT') : null
        ])
    ]);
};

</script>

<style scoped>
.match-card-wrapper {
    position: relative;
}
</style>