<template>
    <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
        <!-- Header -->
        <div
            class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div class="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    <span class="material-symbols-outlined text-xl">{{ icon }}</span>
                </div>
                {{ title }}
            </h3>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-x-auto">
            <table class="min-w-full">
                <thead>
                    <tr
                        class="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th class="px-6 py-3 w-12 text-center">#</th>
                        <th class="px-6 py-3">{{ $t('common.player') }}</th>
                        <th class="px-6 py-3 text-center w-24">{{ statLabel }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-for="(player, index) in data" :key="player.id"
                        class="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                                :class="index < 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'">
                                {{ index + 1 }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <!-- Avatar -->
                                <div class="relative">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 p-0.5 shadow-sm border border-gray-200 dark:border-gray-600 flex-shrink-0 overflow-hidden">
                                        <img v-if="player.photo" :src="player.photo" :alt="player.name"
                                            class="w-full h-full object-cover" />
                                        <div v-else
                                            class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                            {{ player.name?.charAt(0) }}
                                        </div>
                                    </div>
                                    <!-- Team Logo Badge -->
                                    <div v-if="player.team_logo"
                                        class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm">
                                        <img :src="player.team_logo" class="w-3.5 h-3.5 object-contain" />
                                    </div>
                                </div>
                                <!-- Info -->
                                <div>
                                    <div
                                        class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {{ player.name }}
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ player.team_name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span
                                class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-black text-sm border border-primary-100 dark:border-primary-800">
                                {{ player[statKey] }}
                            </span>
                        </td>
                    </tr>
                    <tr v-if="data.length === 0">
                        <td colspan="3" class="px-6 py-12 text-center">
                            <div
                                class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                                <span class="material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">
                                    bar_chart_off
                                </span>
                            </div>
                            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                {{ $t('common.no_data') }}
                            </p>
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
