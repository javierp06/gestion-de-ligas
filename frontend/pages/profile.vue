<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 text-center">
                <div
                    class="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                    {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </div>
                <h1 class="text-3xl font-bold text-text-primary-light dark:text-white mb-2">
                    {{ authStore.user?.name }}
                </h1>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    {{ authStore.user?.email }}
                </p>

                <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8">
                    <span class="material-symbols-outlined text-lg">badge</span>
                    {{ authStore.user?.role || 'Usuario' }}
                </div>

                <div class="border-t border-border-light dark:border-border-dark pt-8">
                    <h2 class="text-xl font-bold text-text-primary-light dark:text-white mb-4">Perfil en construcción
                    </h2>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                        Estamos trabajando en esta sección. Pronto podrás editar tu perfil y ver tus estadísticas
                        personales.
                    </p>
                    <button @click="navigateTo(localePath('/dashboard'))"
                        class="btn-primary px-6 py-2 rounded-xl font-bold shadow-neon">
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { navigateTo, definePageMeta } from '#app'
import { useLocalePath } from '#imports'

const authStore = useAuthStore()
const localePath = useLocalePath()

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
