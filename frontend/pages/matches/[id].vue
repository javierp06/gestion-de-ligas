<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark pb-12">
        <!-- Hero Header -->
        <div
            class="relative bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10 dark:opacity-20">
                <div class="absolute -right-20 -top-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
                <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Navigation & Actions -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div class="flex items-center gap-2 self-start md:self-auto">
                        <button @click="goBack"
                            class="p-2 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-white flex items-center gap-2 pr-2 md:pr-4">
                            <span class="material-symbols-outlined">arrow_back</span>
                            <span class="text-sm font-bold hidden md:inline">{{ $t('nav.matches') }}</span>
                        </button>
                    </div>

                    <div v-if="canManage" class="flex gap-2 animate-fade-in">
                        <button @click="openManageStats"
                            class="btn-secondary px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2">
                            <span class="material-symbols-outlined text-lg md:text-xl">leaderboard</span>
                            {{ $t('match_details.manage_stats') }}
                        </button>
                        <button @click="openEditModal"
                            class="btn-primary px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2">
                            <span class="material-symbols-outlined text-lg md:text-xl">edit</span>
                            {{ $t('match_details.edit_match') }}
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-center py-12">
                    <span
                        class="material-symbols-outlined animate-spin text-4xl text-primary-500">progress_activity</span>
                </div>

                <div v-else-if="match" class="animate-slide-up">
                    <!-- Tournament Info -->
                    <div class="text-center mb-8">
                        <span
                            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-light dark:bg-white/5 border border-border-light dark:border-border-dark text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">
                            <span class="material-symbols-outlined text-lg">emoji_events</span>
                            {{ match.league_name }} - {{ match.tournament_name }}
                        </span>
                    </div>

                    <!-- Live Controls (Organizer Only) -->
                    <LiveMatchControls :match="match" @updated="fetchMatchDetails" />

                    <!-- Scoreboard -->
                    <!-- Scoreboard -->
                    <div
                        class="relative flex items-center justify-between w-full max-w-5xl mx-auto gap-2 md:gap-12 px-2 md:px-0">

                        <!-- Home Team -->
                        <NuxtLink :to="localePath(`/teams/${match.home_team_id}`)"
                            class="flex flex-col items-center gap-2 flex-1 w-1/3 text-center group/team">
                            <div class="relative">
                                <div
                                    class="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white p-2 md:p-4 shadow-lg flex items-center justify-center transform group-hover/team:scale-110 transition-transform duration-300">
                                    <img v-if="match.home_team_logo" :src="match.home_team_logo"
                                        :alt="match.home_team_name" class="w-full h-full object-contain">
                                    <span v-else
                                        class="material-symbols-outlined text-3xl md:text-5xl text-gray-400">groups</span>
                                </div>
                                <div v-if="match.home_score > match.away_score"
                                    class="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <span
                                        class="material-symbols-outlined text-white text-[10px] md:text-sm">emoji_events</span>
                                </div>
                            </div>
                            <div class="w-full">
                                <h2
                                    class="text-xs md:text-2xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight leading-tight group-hover/team:text-primary-500 transition-colors line-clamp-2 md:line-clamp-none h-8 md:h-auto flex items-center justify-center">
                                    {{ match.home_team_name }}
                                </h2>
                                <p
                                    class="hidden md:block text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium mt-1">
                                    {{ $t('match_details.local') }}
                                </p>
                            </div>
                        </NuxtLink>

                        <!-- Score Display -->
                        <div class="flex flex-col items-center gap-2 shrink-0 z-10 -mt-6 md:mt-0">
                            <!-- Status Pill -->
                            <div class="flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10"
                                :class="getStatusClass(match.status)">
                                <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current animate-pulse"></span>
                                <span>{{ getStatusText(match.status) }}</span>
                            </div>

                            <div
                                class="flex items-center justify-center gap-2 md:gap-4 bg-surface-light dark:bg-surface-dark-alt px-4 py-2 md:px-10 md:py-5 rounded-xl md:rounded-3xl border border-border-light dark:border-border-dark shadow-neon min-w-[100px] md:min-w-[200px]">
                                <span
                                    class="text-3xl md:text-7xl font-display font-black text-text-primary-light dark:text-white leading-none">
                                    {{ match.home_score ?? '-' }}
                                </span>
                                <span
                                    class="text-xl md:text-4xl text-text-secondary-light dark:text-text-secondary-dark font-bold opacity-50 relative -top-0.5">:</span>
                                <span
                                    class="text-3xl md:text-7xl font-display font-black text-text-primary-light dark:text-white leading-none">
                                    {{ match.away_score ?? '-' }}
                                </span>
                            </div>
                        </div>

                        <!-- Away Team -->
                        <NuxtLink :to="localePath(`/teams/${match.away_team_id}`)"
                            class="flex flex-col items-center gap-2 flex-1 w-1/3 text-center group/team">
                            <div class="relative">
                                <div
                                    class="w-16 h-16 md:w-32 md:h-32 rounded-full bg-white p-2 md:p-4 shadow-lg flex items-center justify-center transform group-hover/team:scale-110 transition-transform duration-300">
                                    <img v-if="match.away_team_logo" :src="match.away_team_logo"
                                        :alt="match.away_team_name" class="w-full h-full object-contain">
                                    <span v-else
                                        class="material-symbols-outlined text-3xl md:text-5xl text-gray-400">groups</span>
                                </div>
                                <div v-if="match.away_score > match.home_score"
                                    class="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <span
                                        class="material-symbols-outlined text-white text-[10px] md:text-sm">emoji_events</span>
                                </div>
                            </div>
                            <div class="w-full">
                                <h2
                                    class="text-xs md:text-2xl font-display font-black text-text-primary-light dark:text-white uppercase tracking-tight leading-tight group-hover/team:text-primary-500 transition-colors line-clamp-2 md:line-clamp-none h-8 md:h-auto flex items-center justify-center">
                                    {{ match.away_team_name }}
                                </h2>
                                <p
                                    class="hidden md:block text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium mt-1">
                                    {{ $t('match_details.visitor') }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Match Info Bar -->
                    <div class="mt-8 md:mt-12 max-w-4xl mx-auto px-4 md:px-0">
                        <div
                            class="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-white/5 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 shadow-sm">

                            <!-- Date -->
                            <div class="flex items-center gap-3 justify-start md:justify-center pl-2 md:pl-0">
                                <div
                                    class="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    <span class="material-symbols-outlined text-lg md:text-xl">calendar_today</span>
                                </div>
                                <div class="flex flex-col">
                                    <span
                                        class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">{{ $t('match_details.date') }}</span>
                                    <span
                                        class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(match.match_date) }}</span>
                                </div>
                            </div>

                            <!-- Time -->
                            <div class="flex items-center gap-3 justify-start md:justify-center pl-2 md:pl-0">
                                <div
                                    class="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500">
                                    <span class="material-symbols-outlined text-lg md:text-xl">schedule</span>
                                </div>
                                <div class="flex flex-col">
                                    <span
                                        class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">{{ $t('match_details.time') }}</span>
                                    <span
                                        class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ formatTime(match.match_date) }}</span>
                                </div>
                            </div>

                            <!-- Stadium -->
                            <div class="flex items-center gap-3 justify-start md:justify-center pl-2 md:pl-0">
                                <div
                                    class="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                    <span class="material-symbols-outlined text-lg md:text-xl">stadium</span>
                                </div>
                                <div class="flex flex-col max-w-[120px] md:max-w-[150px]">
                                    <span
                                        class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">{{ $t('match_details.stadium') }}</span>
                                    <span
                                        class="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">{{ match.location || $t('match_details.tbd') }}</span>
                                </div>
                            </div>

                            <!-- Referee -->
                            <div class="flex items-center gap-3 justify-start md:justify-center pl-2 md:pl-0">
                                <div
                                    class="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                    <span class="material-symbols-outlined text-lg md:text-xl">sports</span>
                                </div>
                                <div class="flex flex-col max-w-[120px] md:max-w-[150px]">
                                    <span
                                        class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">{{ $t('match_details.referee') }}</span>
                                    <span
                                        class="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">{{ match.referee || $t('match_details.to_be_assigned') }}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Tabs -->
        <div v-if="match" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
                class="grid grid-cols-3 md:flex gap-2 md:gap-4 border-b border-border-light dark:border-border-dark mb-8 overflow-x-hidden p-1">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="px-2 md:px-6 py-3 font-bold text-sm transition-all duration-300 border-b-2 whitespace-nowrap text-center flex items-center justify-center bg-surface-light dark:bg-surface-dark md:bg-transparent md:dark:bg-transparent rounded-t-lg md:rounded-none"
                    :class="activeTab === tab.id ? 'border-primary-500 text-primary-500 bg-primary-50 dark:bg-primary-900/10 md:bg-transparent' : 'border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Summary Tab -->
            <div v-if="activeTab === 'summary'" class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <!-- Match Events -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">timeline</span>
                        {{ $t('match_details.match_events') }}
                    </h3>

                    <div v-if="matchEvents.length > 0" class="space-y-4">
                        <div v-for="(event, index) in matchEvents" :key="index" class="flex items-center gap-4">
                            <div class="w-12 text-right font-mono font-bold text-primary-500">{{ event.minute }}'</div>
                            <div
                                class="w-8 h-8 rounded-full bg-background-light dark:bg-white/5 flex items-center justify-center border border-border-light dark:border-border-dark">
                                <span class="material-symbols-outlined text-sm"
                                    :class="getEventColor(event.type)">{{ getEventIcon(event.type) }}</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                    {{ event.player_name }}
                                </p>
                                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                    {{ getEventText(event.type) }}
                                </p>
                            </div>
                            <div
                                class="text-xs font-bold px-2 py-1 rounded bg-background-light dark:bg-white/5 border border-border-light dark:border-border-dark">
                                {{ event.team_name }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">timer_off</span>
                        <p>{{ $t('match_details.no_events') }}</p>
                    </div>
                </div>

                <!-- Match Stats -->
                <div
                    class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6">
                    <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary-500">analytics</span>
                        {{ $t('match_details.manage_stats') }}
                    </h3>

                    <div class="space-y-6">
                        <div v-for="(stat, index) in teamStats" :key="index" class="space-y-2">
                            <div class="flex justify-between text-sm font-bold text-text-primary-light dark:text-white">
                                <span>{{ stat.homeValue }}</span>
                                <span>{{ stat.label }}</span>
                                <span>{{ stat.awayValue }}</span>
                            </div>
                            <div class="flex h-2 rounded-full overflow-hidden bg-background-light dark:bg-white/5">
                                <div class="bg-primary-500"
                                    :style="{ width: getStatPercentage(stat.homeValue, stat.awayValue) + '%' }"></div>
                                <div class="bg-blue-500"
                                    :style="{ width: getStatPercentage(stat.awayValue, stat.homeValue) + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lineups Tab -->
            <div v-else-if="activeTab === 'lineups'" class="animate-fade-in">
                <SoccerFieldLineup :home-players="homeLineup" :away-players="awayLineup"
                    :home-team-name="match.home_team_name" :away-team-name="match.away_team_name" />

                <!-- Fallback if no players -->
                <div v-if="homeLineup.length === 0 && awayLineup.length === 0"
                    class="text-center py-12 text-gray-500 dark:text-gray-400 mt-4">
                    <span class="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                    <p>{{ $t('match_details.no_lineup') }}</p>
                </div>
            </div>

            <!-- Stats Tab -->
            <div v-else-if="activeTab === 'stats'" class="animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Home Team Stats -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div
                            class="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50">
                            <img v-if="match.home_team_logo" :src="match.home_team_logo" class="w-8 h-8 object-contain">
                            <h3 class="font-bold text-lg dark:text-white">{{ match.home_team_name }}</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                                    <tr>
                                        <th class="px-4 py-3">{{ $t('match_details.player') }}</th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.goals')">G
                                        </th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.assists')">A
                                        </th>
                                        <th class="px-2 py-3 text-center"
                                            :title="$t('match_details.stats.yellow_cards')">TA</th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.red_cards')">
                                            TR</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                                    <tr v-for="player in homePlayers.filter(p => p.goals || p.assists || p.yellow_cards || p.red_cards)"
                                        :key="player.id"
                                        class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td class="px-4 py-3 font-medium text-text-primary-light dark:text-white">
                                            {{ player.name }}
                                        </td>
                                        <td class="px-2 py-3 text-center font-bold text-gray-900 dark:text-white">
                                            {{ player.goals || '-' }}
                                        </td>
                                        <td class="px-2 py-3 text-center text-gray-600 dark:text-gray-400">
                                            {{ player.assists || '-' }}
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span v-if="player.yellow_cards"
                                                class="inline-block w-3 h-4 bg-yellow-400 rounded-[1px] shadow-sm ml-1"
                                                :title="player.yellow_cards + ' Matches'"></span>
                                            <span v-if="player.yellow_cards > 1"
                                                class="text-xs ml-1 font-bold">{{ player.yellow_cards }}</span>
                                            <span v-else class="text-gray-300 dark:text-gray-700">-</span>
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span v-if="player.red_cards"
                                                class="inline-block w-3 h-4 bg-red-500 rounded-[1px] shadow-sm ml-1"></span>
                                            <span v-if="player.red_cards > 1"
                                                class="text-xs ml-1 font-bold">{{ player.red_cards }}</span>
                                            <span v-else class="text-gray-300 dark:text-gray-700">-</span>
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="!homePlayers.some(p => p.goals || p.assists || p.yellow_cards || p.red_cards)">
                                        <td colspan="5" class="px-4 py-8 text-center text-gray-500 italic">
                                            {{ $t('match_details.no_events') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Away Team Stats -->
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div
                            class="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50">
                            <img v-if="match.away_team_logo" :src="match.away_team_logo" class="w-8 h-8 object-contain">
                            <h3 class="font-bold text-lg dark:text-white">{{ match.away_team_name }}</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                                    <tr>
                                        <th class="px-4 py-3">{{ $t('match_details.player') }}</th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.goals')">G
                                        </th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.assists')">A
                                        </th>
                                        <th class="px-2 py-3 text-center"
                                            :title="$t('match_details.stats.yellow_cards')">TA</th>
                                        <th class="px-2 py-3 text-center" :title="$t('match_details.stats.red_cards')">
                                            TR</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                                    <tr v-for="player in awayPlayers.filter(p => p.goals || p.assists || p.yellow_cards || p.red_cards)"
                                        :key="player.id"
                                        class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td class="px-4 py-3 font-medium text-text-primary-light dark:text-white">
                                            {{ player.name }}
                                        </td>
                                        <td class="px-2 py-3 text-center font-bold text-gray-900 dark:text-white">
                                            {{ player.goals || '-' }}
                                        </td>
                                        <td class="px-2 py-3 text-center text-gray-600 dark:text-gray-400">
                                            {{ player.assists || '-' }}
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span v-if="player.yellow_cards"
                                                class="inline-block w-3 h-4 bg-yellow-400 rounded-[1px] shadow-sm ml-1"></span>
                                            <span v-if="player.yellow_cards > 1"
                                                class="text-xs ml-1 font-bold">{{ player.yellow_cards }}</span>
                                            <span v-else class="text-gray-300 dark:text-gray-700">-</span>
                                        </td>
                                        <td class="px-2 py-3 text-center">
                                            <span v-if="player.red_cards"
                                                class="inline-block w-3 h-4 bg-red-500 rounded-[1px] shadow-sm ml-1"></span>
                                            <span v-if="player.red_cards > 1"
                                                class="text-xs ml-1 font-bold">{{ player.red_cards }}</span>
                                            <span v-else class="text-gray-300 dark:text-gray-700">-</span>
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="!awayPlayers.some(p => p.goals || p.assists || p.yellow_cards || p.red_cards)">
                                        <td colspan="5" class="px-4 py-8 text-center text-gray-500 italic">
                                            {{ $t('match_details.no_events') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modals -->
            <UpdateScoreModal v-if="showEditModal && match" :match="match" @close="showEditModal = false"
                @updated="fetchMatchDetails" />

            <UpdateMatchStatsModal v-if="showStatsModal && match" :match="match" @close="showStatsModal = false"
                @updated="fetchMatchDetails" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '@/stores/auth'
import UpdateScoreModal from '@/components/modals/UpdateScoreModal.vue'
import UpdateMatchStatsModal from '@/components/modals/UpdateMatchStatsModal.vue'
import LiveMatchControls from '@/components/LiveMatchControls.vue'
import SoccerFieldLineup from '@/components/SoccerFieldLineup.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const localePath = useLocalePath()
const { locale } = useI18n()

const match = ref<any>(null)
const loading = ref(true)
const activeTab = ref('summary')
const showEditModal = ref(false)
const showStatsModal = ref(false)

const tabs = computed(() => [
    { id: 'summary', label: t('match_details.tabs.summary') },
    { id: 'lineups', label: t('match_details.tabs.lineups') },
    { id: 'stats', label: t('match_details.tabs.stats') }
])

const canManage = computed(() => {
    return authStore.isAdmin || authStore.isOrganizer
})

const openEditModal = () => {
    showEditModal.value = true
}

const openManageStats = () => {
    showStatsModal.value = true
}

const fetchMatchDetails = async () => {
    loading.value = true
    try {
        const response = await $api.get(`/matches/${route.params.id}`)
        if (response.data.success) {
            match.value = response.data.data
        }
    } catch (error) {
        console.error('Error fetching match details:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMatchDetails()
})

const getRosterWithStats = (roster: any[], stats: any[]) => {
    if (!roster) return []
    return roster.map(player => {
        const playerStats = stats?.find((s: any) => s.player_id === player.id)
        return {
            ...player,
            ...playerStats,
            id: player.id,
            name: player.name
        }
    })
}

const homePlayers = computed(() => {
    if (!match.value) return []
    return getRosterWithStats(match.value.home_roster, match.value.player_stats)
})

const awayPlayers = computed(() => {
    if (!match.value) return []
    return getRosterWithStats(match.value.away_roster, match.value.player_stats)
})

const getStartingEleven = (allPlayers: any[]) => {
    // 1. Filter by participation if stats exist
    // If any player has 'player_id' (from stats merge), it means stats have been recorded.
    // We only show those players in the lineup.
    const playersWithStats = allPlayers.filter(p => p.player_id)

    let candidates = allPlayers
    if (playersWithStats.length > 0) {
        candidates = playersWithStats
    }

    // Priority: GK -> Def -> Mid -> Fwd
    const roleWeight = (p: string) => {
        if (!p) return 5
        p = p.toLowerCase()
        if (p.includes('portero') || p.includes('goalkeeper')) return 1
        if (p.includes('defensa') || p.includes('defender')) return 2
        if (p.includes('medio') || p.includes('mid')) return 3
        if (p.includes('delantero') || p.includes('forward')) return 4
        return 5
    }

    const sorted = [...candidates].sort((a, b) => roleWeight(a.position) - roleWeight(b.position))
    return sorted.slice(0, 11)
}

const homeLineup = computed(() => getStartingEleven(homePlayers.value))
const awayLineup = computed(() => getStartingEleven(awayPlayers.value))

const matchEvents = computed(() => {
    if (!match.value?.player_stats) return []
    const events: any[] = []

    // Helper for deterministic random based on seed (Mock timestamps until DB support)
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    match.value.player_stats.forEach((p: any) => {
        // Goals
        for (let i = 0; i < p.goals; i++) {
            const seed = (p.id || p.player_id) * 100 + i
            const minute = Math.floor(pseudoRandom(seed) * 90) + 1
            events.push({
                minute,
                type: 'goal',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
        // Yellow Cards
        for (let i = 0; i < p.yellow_cards; i++) {
            const seed = (p.id || p.player_id) * 200 + i
            const minute = Math.floor(pseudoRandom(seed) * 90) + 1
            events.push({
                minute,
                type: 'yellow_card',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
        // Red Cards
        for (let i = 0; i < p.red_cards; i++) {
            const seed = (p.id || p.player_id) * 300 + i
            const minute = Math.floor(pseudoRandom(seed) * 90) + 1
            events.push({
                minute,
                type: 'red_card',
                player_name: p.player_name,
                team_name: p.team_name
            })
        }
    })

    return events.sort((a, b) => a.minute - b.minute)
})

const teamStats = computed(() => {
    if (!match.value?.player_stats) return []

    const homeStats = match.value.player_stats.filter((p: any) => p.team_name === match.value.home_team_name)
    const awayStats = match.value.player_stats.filter((p: any) => p.team_name === match.value.away_team_name)

    const sum = (arr: any[], key: string) => arr.reduce((acc, curr) => acc + (curr[key] || 0), 0)

    return [
        { label: t('match_details.stats.goals'), homeValue: match.value.home_score || 0, awayValue: match.value.away_score || 0 },
        { label: t('match_details.stats.yellow_cards'), homeValue: sum(homeStats, 'yellow_cards'), awayValue: sum(awayStats, 'yellow_cards') },
        { label: t('match_details.stats.red_cards'), homeValue: sum(homeStats, 'red_cards'), awayValue: sum(awayStats, 'red_cards') },
        { label: t('match_details.stats.assists'), homeValue: sum(homeStats, 'assists'), awayValue: sum(awayStats, 'assists') }
    ]
})

const getStatPercentage = (val1: number, val2: number) => {
    const total = val1 + val2
    if (total === 0) return 50
    return (val1 / total) * 100
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale.value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale.value, {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusText = (status: string) => {
    return t(`match_details.status.${status}`)
}

const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
        'scheduled': 'bg-blue-500/10 text-blue-500',
        'live': 'bg-red-500/10 text-red-500',
        'finished': 'bg-green-500/10 text-green-500',
        'postponed': 'bg-orange-500/10 text-orange-500',
        'cancelled': 'bg-gray-500/10 text-gray-500'
    }
    return map[status] || 'bg-gray-500/10 text-gray-500'
}

const getEventIcon = (type: string) => {
    const map: Record<string, string> = {
        'goal': 'sports_soccer',
        'yellow_card': 'style',
        'red_card': 'style'
    }
    return map[type] || 'info'
}

const getEventColor = (type: string) => {
    const map: Record<string, string> = {
        'goal': 'text-green-500',
        'yellow_card': 'text-yellow-500',
        'red_card': 'text-red-500'
    }
    return map[type] || 'text-gray-500'
}

const getEventText = (type: string) => {
    return t(`match_details.events.${type}`)
}

const goBack = () => {
    if (match.value?.tournament_id) {
        router.push(localePath(`/tournaments/${match.value.tournament_id}`))
    } else {
        router.push(localePath('/matches'))
    }
}

definePageMeta({
    layout: 'default'
})
</script>
