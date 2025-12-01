<template>
    <div class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div class="text-center max-w-lg w-full">
            <!-- 404 Illustration/Text -->
            <div class="relative mb-8">
                <h1 class="text-9xl font-black text-primary-500/20 dark:text-primary-500/10 select-none">
                    {{ error.statusCode }}
                </h1>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-8xl text-primary-500 animate-bounce">
                        sports_soccer
                    </span>
                </div>
            </div>

            <h2 class="text-3xl md:text-4xl font-display font-bold text-text-primary-light dark:text-white mb-4">
                {{ error.statusCode === 404 ? '¡Fuera de Juego!' : 'Error del Sistema' }}
            </h2>

            <p class="text-text-secondary-light dark:text-text-secondary-dark text-lg mb-8">
                {{ error.statusCode === 404
                    ? 'Parece que la página que buscas no existe o ha sido movida.'
                    : 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.' }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button @click="handleError"
                    class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">home</span>
                    Volver al Inicio
                </button>

                <button @click="router.back()"
                    class="px-8 py-3 rounded-xl font-bold border-2 border-border-light dark:border-border-dark text-text-primary-light dark:text-white hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Regresar
                </button>
            </div>

            <!-- Error Details (Dev only) -->
            <div v-if="error.statusCode !== 404 && dev"
                class="mt-12 p-4 bg-red-500/10 rounded-xl text-left overflow-auto max-h-48">
                <p class="text-red-500 font-mono text-xs">{{ error.message }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    error: Object
})

const router = useRouter()
const localePath = useLocalePath()

const handleError = () => {
    clearError({ redirect: localePath('/') })
}

const dev = import.meta.dev
</script>
