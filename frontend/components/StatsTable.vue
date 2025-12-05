<template>
    <div
        class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
        <!-- Header -->
        <div
            class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50 dark:bg-white/5">
            <h3 class="text-lg font-bold text-text-primary-light dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary-500">{{ icon }}</span>
                {{ title }}
            </h3>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead>
                    <tr
                        class="bg-gray-50/50 dark:bg-white/5 text-left text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                        <th class="px-6 py-3">#</th>
                        <th class="px-6 py-3">Jugador</th>
                        <th class="px-6 py-3 text-center">{{ statLabel }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    <tr v-for="(player, index) in data" :key="player.id"
                        class="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark w-12">
                            {{ index + 1 }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <!-- Avatar -->
                                <div
                                    class="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark-alt p-0.5 shadow-sm border border-border-light dark:border-border-dark flex-shrink-0">
                                    <img v-if="player.photo" :src="player.photo" :alt="player.name"
                                        class="w-full h-full rounded-full object-cover" />
                                    <div v-else
                                        class="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                        {{ player.name?.charAt(0) }}
                                    </div>
                                </div>
                                <!-- Info -->
                                <div>
                                    <div
                                        class="font-bold text-text-primary-light dark:text-white group-hover:text-primary-500 transition-colors">
                                        {{ player.name }}
                                    </div>
                                    <div
                                        class="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                                        <img v-if="player.team_logo" :src="player.team_logo"
                                            class="w-3 h-3 object-contain" />
                                        {{ player.team_name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span
                                class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-black text-sm">
                                {{ player[statKey] }}
                            </span>
                        </td>
                    </tr>
                    <tr v-if="data.length === 0">
                        <td colspan="3"
                            class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm italic">
                            No hay datos disponibles
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    icon: string
    data: any[]
    statLabel: string
    statKey: string
}>()
</script>
