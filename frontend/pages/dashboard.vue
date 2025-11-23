<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Welcome Header -->
            <div class="mb-8 animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Bienvenido, {{ authStore.user?.name || 'Usuario' }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    <span :class="getRoleBadgeClass(authStore.user?.role || 'user')"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                        <span
                            class="material-symbols-outlined text-sm mr-1">{{ getRoleIcon(authStore.user?.role || 'user') }}</span>
                        {{ getRoleText(authStore.user?.role || 'user') }}
                    </span>
                </p>
            </div>

            <!-- ADMIN Dashboard -->
            <div v-if="authStore.isAdmin">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="animate-slide-up stagger-1">
                        <StatsCard title="Total Usuarios" :value="stats.totalUsers || 0" icon="group" color="blue" />
                    </div>
                    <div class="animate-slide-up stagger-2">
                        <StatsCard title="Ligas Activas" :value="stats.activeLeagues || 0" icon="emoji_events"
                            color="green" />
                    </div>
                    <div class="animate-slide-up stagger-3">
                        <StatsCard title="Torneos en Curso" :value="stats.activeTournaments || 0" icon="sports"
                            color="purple" />
                    </div>
                    <div class="animate-slide-up stagger-4">
                        <StatsCard title="Partidos Hoy" :value="stats.todayMatches || 0" icon="today" color="orange" />
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 animate-slide-up">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="animate-scale-in stagger-1">
                            <QuickAction title="Gestionar Usuarios" description="Ver y administrar usuarios"
                                icon="manage_accounts" @click="navigateTo('/admin/users')" />
                        </div>
                        <div class="animate-scale-in stagger-2">
                            <QuickAction title="Ver Ligas" description="Administrar todas las ligas" icon="emoji_events"
                                @click="navigateTo('/leagues')" />
                        </div>
                        <div class="animate-scale-in stagger-3">
                            <QuickAction title="Reportes" description="Ver estadísticas del sistema" icon="analytics"
                                @click="navigateTo('/admin/reports')" />
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
                    <div class="space-y-3">
                        <div v-for="i in 5" :key="i"
                            class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary">person</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">Usuario registrado</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Hace 5 minutos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ORGANIZER Dashboard -->
            <div v-else-if="authStore.isOrganizer">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="animate-slide-up stagger-1">
                        <StatsCard title="Mis Ligas" :value="myLeagues?.length || 0" icon="emoji_events" color="blue" />
                    </div>
                    <div class="animate-slide-up stagger-2">
                        <StatsCard title="Torneos" :value="myTournaments?.length || 0" icon="sports" color="green" />
                    </div>
                    <div class="animate-slide-up stagger-3">
                        <StatsCard title="Equipos" :value="stats.totalTeams || 0" icon="group" color="purple" />
                    </div>
                    <div class="animate-slide-up stagger-4">
                        <StatsCard title="Partidos Pendientes" :value="stats.pendingMatches || 0" icon="schedule"
                            color="orange" />
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined">bolt</span>
                        Acciones Rápidas
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickAction title="Crear Liga" description="Inicia una nueva liga" icon="add_circle"
                            @click="showCreateLeagueModal = true" />
                        <QuickAction title="Gestionar Torneos" description="Ver y editar torneos" icon="emoji_events"
                            @click="navigateTo('/tournaments')" />
                        <QuickAction title="Registrar Resultado" description="Actualizar marcadores" icon="edit_square"
                            @click="navigateTo('/matches')" />
                    </div>
                </div>

                <!-- My Leagues -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Mis Ligas</h2>
                    <div v-if="myLeagues?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <LeagueCard v-for="league in myLeagues" :key="league.id" :league="league"
                            @click="navigateTo(`/leagues/${league.id}`)" />
                    </div>
                    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <span class="material-symbols-outlined text-5xl mb-2">emoji_events</span>
                        <p>No has creado ninguna liga todavía</p>
                        <button @click="showCreateLeagueModal = true" class="btn-primary mt-4">
                            Crear Primera Liga
                        </button>
                    </div>
                </div>

                <!-- Upcoming Matches -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Próximos Partidos</h2>
                    <div v-if="upcomingMatches?.length" class="space-y-3">
                        <MatchCard v-for="match in upcomingMatches.slice(0, 5)" :key="match.id" :match="match" />
                    </div>
                    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <span class="material-symbols-outlined text-5xl mb-2">sports_soccer</span>
                        <p>No hay partidos programados</p>
                    </div>
                </div>
            </div>

            <!-- USER Dashboard -->
            <div v-else>
                <!-- Welcome Message -->
                <div class="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg shadow-lg p-8 mb-8 animate-scale-in hover-glow">
                    <h2 class="text-2xl font-bold mb-2">¡Empieza tu Aventura Deportiva!</h2>
                    <p class="text-blue-100 mb-4">
                        Únete a ligas, crea tu equipo o conviértete en organizador
                    </p>
                    <button @click="showCreateLeagueModal = true"
                        class="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Crear Mi Primera Liga
                    </button>
                </div>

                <!-- Quick Links -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div @click="navigateTo('/leagues')"
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer card-interactive animate-slide-up stagger-1">
                        <div
                            class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-primary text-2xl">emoji_events</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Explorar Ligas</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Encuentra y únete a ligas activas</p>
                    </div>

                    <div @click="navigateTo('/tournaments')"
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer card-interactive animate-slide-up stagger-2">
                        <div
                            class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-green-600 text-2xl">trophy</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Ver Torneos</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Descubre torneos en curso</p>
                    </div>

                    <div @click="showCreateTeamModal = true"
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer card-interactive animate-slide-up stagger-3">
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-purple-600 text-2xl">group_add</span>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Crear Equipo</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Forma tu propio equipo</p>
                    </div>
                </div>

                <!-- Recent Leagues -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Ligas Destacadas</h2>
                    <div v-if="recentLeagues?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <LeagueCard v-for="league in recentLeagues.slice(0, 6)" :key="league.id" :league="league"
                            @click="navigateTo(`/leagues/${league.id}`)" />
                    </div>
                    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <span class="material-symbols-outlined text-5xl mb-2">sentiment_dissatisfied</span>
                        <p>No hay ligas disponibles todavía</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <CreateLeagueModal v-if="showCreateLeagueModal" @close="showCreateLeagueModal = false"
            @created="handleLeagueCreated" />
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { $api } = useNuxtApp()

const showCreateLeagueModal = ref(false)
const showCreateTeamModal = ref(false)

// Fetch user-specific data
const { data: myLeagues } = await useAsyncData('my-leagues', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/leagues')
    const allLeagues = response.data.success ? response.data.data : []
    return allLeagues.filter((l: any) => l.organizer_id === authStore.user?.id)
}, { watch: [() => authStore.user?.id] })

const { data: myTournaments } = await useAsyncData('my-tournaments', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/tournaments')
    return response.data.success ? response.data.data : []
})

const { data: recentLeagues } = await useAsyncData('recent-leagues', async () => {
    const response = await $api.get('/leagues?status=active')
    return response.data.success ? response.data.data : []
})

const { data: upcomingMatches } = await useAsyncData('upcoming-matches', async () => {
    if (!authStore.isOrganizer) return []
    const response = await $api.get('/matches?status=scheduled')
    return response.data.success ? response.data.data : []
})

const stats = computed(() => ({
    totalUsers: 156,
    activeLeagues: recentLeagues.value?.length || 0,
    activeTournaments: myTournaments.value?.filter((t: any) => t.status === 'in_progress').length || 0,
    todayMatches: 8,
    totalTeams: 42,
    pendingMatches: upcomingMatches.value?.length || 0
}))

const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
        'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'organizer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'user': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
    return classes[role] || classes.user
}

const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
        'admin': 'shield',
        'organizer': 'emoji_events',
        'user': 'person'
    }
    return icons[role] || 'person'
}

const getRoleText = (role: string) => {
    const texts: Record<string, string> = {
        'admin': 'Administrador',
        'organizer': 'Organizador',
        'user': 'Usuario'
    }
    return texts[role] || 'Usuario'
}

const handleLeagueCreated = () => {
    showCreateLeagueModal.value = false
    refreshNuxtData('my-leagues')
    refreshNuxtData('recent-leagues')
}

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
