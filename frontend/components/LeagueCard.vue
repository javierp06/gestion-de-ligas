<template>
    <div @click="$emit('click')"
        class="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md hover:shadow-neon transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden border border-border-light dark:border-border-dark group">
        <!-- Image/Logo -->
        <div v-if="league.logo"
            class="h-48 bg-gradient-to-br from-primary-500/20 to-blue-600/20 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <img :src="league.logo" :alt="league.name"
                class="h-32 w-32 object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div v-else
            class="h-48 bg-gradient-to-br from-primary-500/20 to-blue-600/20 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <span
                class="text-7xl transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">{{ getSportEmoji(league.sport_name || league.sport?.name || '') }}</span>
        </div>

        <!-- Content -->
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
                <h3
                    class="text-xl font-display font-bold text-text-primary-light dark:text-white line-clamp-2 flex-1 group-hover:text-primary-500 transition-colors">
                    {{ league.name }}
                </h3>
                <span :class="getStatusColor(league.status)"
                    class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap ml-2 border">
                    {{ getStatusText(league.status) }}
                </span>
            </div>

            <!-- Sport -->
            <p
                class="text-sm text-primary-600 dark:text-primary-500 font-bold mb-2 flex items-center gap-1 uppercase tracking-wide">
                <span class="material-symbols-outlined text-sm">sports</span>
                {{ league.sport_name || league.sport?.name || $t('components.league_card.sport_fallback') }}
            </p>

            <!-- Description -->
            <p v-if="league.description"
                class="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-2 font-medium">
                {{ league.description }}
            </p>

            <!-- Footer Info -->
            <div
                class="flex items-center justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark pt-4 border-t border-border-light dark:border-border-dark">
                <div v-if="league.location" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    <span class="font-medium">{{ league.location }}</span>
                </div>
                <div v-if="league.organizer_name" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">person</span>
                    <span class="font-medium">{{ league.organizer_name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { getSportEmoji, getStatusColor, getStatusText } = useSports()

interface League {
    id: number
    name: string
    description?: string
    sport_name?: string
    sport?: { name: string }
    status: string
    location?: string
    organizer_name?: string
    logo?: string
}

defineProps<{
    league: League
}>()

defineEmits<{
    click: []
}>()
</script>
