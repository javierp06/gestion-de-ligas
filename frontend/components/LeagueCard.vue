<template>
    <div @click="$emit('click')"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden">
        <!-- Image/Logo -->
        <div v-if="league.logo"
            class="h-48 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <img :src="league.logo" :alt="league.name" class="h-32 w-32 object-contain" />
        </div>
        <div v-else class="h-48 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span class="text-7xl">{{ getSportEmoji(league.sport_name || league.sport?.name || '') }}</span>
        </div>

        <!-- Content -->
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {{ league.name }}
                </h3>
                <span :class="getStatusColor(league.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                    {{ getStatusText(league.status) }}
                </span>
            </div>

            <!-- Sport -->
            <p class="text-sm text-primary font-medium mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">sports</span>
                {{ league.sport_name || league.sport?.name || $t('components.league_card.sport_fallback') }}
            </p>

            <!-- Description -->
            <p v-if="league.description" class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {{ league.description }}
            </p>

            <!-- Footer Info -->
            <div
                class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div v-if="league.location" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    <span>{{ league.location }}</span>
                </div>
                <div v-if="league.organizer_name" class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">person</span>
                    <span>{{ league.organizer_name }}</span>
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
