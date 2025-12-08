<template>
    <button @click.stop="toggle" class="flex items-center justify-center transition-all duration-300 group" :class="[
        isFav ? 'text-red-500 scale-110' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 hover:scale-110',
        sizeClasses
    ]" :title="isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'">
        <span class="material-symbols-outlined transition-transform duration-300"
            :class="{ 'filled': isFav, 'animate-pulse-once': justToggled }"
            :style="{ fontVariationSettings: `'FILL' ${isFav ? 1 : 0}` }">
            favorite
        </span>
    </button>
</template>

<style scoped>
.filled {
    font-variation-settings: 'FILL' 1;
}

@keyframes pulse-once {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}

.animate-pulse-once {
    animation: pulse-once 0.3s ease-in-out;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFavoritesStore } from '@/stores/favorites';

const props = defineProps<{
    type: 'league' | 'team' | 'tournament';
    id: number;
    size?: 'sm' | 'md' | 'lg';
}>();

const favoritesStore = useFavoritesStore();
const justToggled = ref(false);

const isFav = computed(() => favoritesStore.isFavorite(props.type, props.id));

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm': return 'w-8 h-8 text-lg';
        case 'lg': return 'w-12 h-12 text-3xl';
        default: return 'w-10 h-10 text-2xl';
    }
});

const toggle = async () => {
    justToggled.value = true;
    await favoritesStore.toggleFavorite(props.type, props.id);
    setTimeout(() => justToggled.value = false, 300);
};
</script>
