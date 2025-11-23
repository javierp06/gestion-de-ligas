<template>
    <div
        class="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-lg group">
        <!-- Background Effects -->
        <div
            class="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[50px] transform translate-x-10 -translate-y-10 group-hover:bg-primary-500/20 transition-colors duration-500">
        </div>

        <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
                <div
                    class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-500 group-hover:scale-110 transition-transform duration-300">
                    <span class="material-symbols-outlined text-2xl">trophy</span>
                </div>
                <span class="flex h-2 w-2">
                    <span
                        class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
            </div>

            <h3 class="text-lg font-display font-bold text-text-primary-light dark:text-white mb-2 leading-tight">
                {{ $t('promo.title') }}
            </h3>

            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                {{ $t('promo.description') }}
            </p>

            <NuxtLink to="/leagues/create"
                class="inline-flex items-center justify-center w-full py-3 px-4 bg-primary-500 text-black font-bold rounded-xl shadow-neon hover:shadow-neon-strong hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm uppercase tracking-wide">
                <span class="material-symbols-outlined text-lg mr-2">add_circle</span>
                {{ $t('promo.cta') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
// No props needed for this simple widget
</script>
