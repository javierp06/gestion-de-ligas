<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse">
        <div class="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
        <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="league">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <span class="text-5xl">{{ getSportEmoji(league.sport?.name || '') }}</span>
                <div>
                  <h1 class="text-4xl font-bold">{{ league.name }}</h1>
                  <p class="text-blue-100 mt-1">{{ league.sport?.name }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-4 mt-4 text-sm">
                <span :class="getStatusColor(league.status)" class="px-3 py-1 rounded-full font-medium">
                  {{ getStatusText(league.status) }}
                </span>
                <span v-if="league.location" class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">location_on</span>
                  {{ league.location }}
                </span>
                <span v-if="league.organizer_name" class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">person</span>
                  {{ league.organizer_name }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="canManage" class="flex gap-2">
              <button @click="editLeague" class="btn-primary bg-white text-primary hover:bg-gray-100">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="deleteLeague" class="btn-primary bg-red-600 hover:bg-red-700">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex gap-8">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              @click="activeTab = tab.value"
              class="py-4 px-2 border-b-2 font-medium transition-colors"
              :class="activeTab === tab.value 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tournaments Tab -->
        <div v-if="activeTab === 'tournaments'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold dark:text-white">Torneos</h2>
            <button 
              v-if="canManage"
              @click="showCreateTournamentModal = true"
              class="btn-primary flex items-center gap-2"
            >
              <span class="material-symbols-outlined">add_circle</span>
              Crear Torneo
            </button>
          </div>

          <div v-if="tournaments?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TournamentCard 
              v-for="tournament in tournaments" 
              :key="tournament.id" 
              :tournament="tournament"
              @click="navigateTo(`/tournaments/${tournament.id}`)"
            />
          </div>
          <div v-else class="text-center py-16">
            <span class="material-symbols-outlined text-gray-300 dark:text-gray-600" style="font-size: 80px">emoji_events</span>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">No hay torneos todavía</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Crea el primer torneo de esta liga</p>
          </div>
        </div>

        <!-- Teams Tab -->
        <div v-if="activeTab === 'teams'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold dark:text-white">Equipos</h2>
            <button 
              v-if="authStore.isAuthenticated"
              @click="showCreateTeamModal = true"
              class="btn-primary flex items-center gap-2"
            >
              <span class="material-symbols-outlined">add_circle</span>
              Crear Equipo
            </button>
          </div>

          <div v-if="teams?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TeamCard 
              v-for="team in teams" 
              :key="team.id" 
              :team="team"
            />
          </div>
          <div v-else class="text-center py-16">
            <span class="material-symbols-outlined text-gray-300 dark:text-gray-600" style="font-size: 80px">group</span>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">No hay equipos todavía</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Sé el primero en crear un equipo</p>
          </div>
        </div>

        <!-- Info Tab -->
        <div v-if="activeTab === 'info'">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4 dark:text-white">Información</h2>
            <div v-if="league.description" class="prose dark:prose-invert max-w-none mb-6">
              <p>{{ league.description }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="league.organizer_name" class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary">person</span>
                <div>
                  <p class="font-semibold dark:text-white">Organizador</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ league.organizer_name }}</p>
                </div>
              </div>
              
              <div v-if="league.sport" class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary">sports</span>
                <div>
                  <p class="font-semibold dark:text-white">Deporte</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ league.sport.name }}</p>
                </div>
              </div>
              
              <div v-if="league.location" class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary">location_on</span>
                <div>
                  <p class="font-semibold dark:text-white">Ubicación</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ league.location }}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary">calendar_today</span>
                <div>
                  <p class="font-semibold dark:text-white">Fecha de creación</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ formatDate(league.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateTournamentModal 
      v-if="showCreateTournamentModal" 
      :leagueId="parseInt(route.params.id as string)"
      @close="showCreateTournamentModal = false" 
      @created="handleTournamentCreated" 
    />
    <CreateTeamModal 
      v-if="showCreateTeamModal" 
      :leagueId="parseInt(route.params.id as string)"
      @close="showCreateTeamModal = false" 
      @created="handleTeamCreated" 
    />

    <!-- Floating Action Button (para organizadores) -->
    <FloatingActionButton 
      v-if="canManage && fabActions.length > 0"
      :actions="fabActions"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { $api } = useNuxtApp()

const activeTab = ref('tournaments')
const showCreateTournamentModal = ref(false)
const showCreateTeamModal = ref(false)

const tabs = [
  { value: 'tournaments', label: 'Torneos' },
  { value: 'teams', label: 'Equipos' },
  { value: 'info', label: 'Información' }
]

// FAB Actions for organizers
const fabActions = computed(() => {
  if (!canManage.value) return []
  return [
    {
      icon: 'emoji_events',
      label: 'Crear Torneo',
      color: 'bg-blue-600 text-white',
      onClick: () => showCreateTournamentModal.value = true
    },
    {
      icon: 'group_add',
      label: 'Crear Equipo',
      color: 'bg-green-600 text-white',
      onClick: () => showCreateTeamModal.value = true
    },
    {
      icon: 'edit',
      label: 'Editar Liga',
      color: 'bg-orange-600 text-white',
      onClick: editLeague
    }
  ]
})

// Fetch league
const { data: league, pending } = await useAsyncData(`league-${route.params.id}`, async () => {
  const response = await $api.get(`/leagues/${route.params.id}`)
  return response.data.success ? response.data.data : null
})

// Fetch tournaments
const { data: tournaments, refresh: refreshTournaments } = await useAsyncData(`tournaments-${route.params.id}`, async () => {
  const response = await $api.get(`/tournaments?league_id=${route.params.id}`)
  return response.data.success ? response.data.data : []
})

// Fetch teams
const { data: teams, refresh: refreshTeams } = await useAsyncData(`teams-${route.params.id}`, async () => {
  const response = await $api.get(`/teams?league_id=${route.params.id}`)
  return response.data.success ? response.data.data : []
})

const canManage = computed(() => {
  if (!authStore.user || !league.value) return false
  return authStore.user.id === league.value.organizer_id || authStore.isAdmin
})

const handleTournamentCreated = () => {
  showCreateTournamentModal.value = false
  refreshTournaments()
}

const handleTeamCreated = () => {
  showCreateTeamModal.value = false
  refreshTeams()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const editLeague = () => {
  toastStore.info('Funcionalidad de edición próximamente')
}

const deleteLeague = async () => {
  if (!confirm('¿Estás seguro de eliminar esta liga? Esta acción no se puede deshacer.')) return
  
  try {
    const response = await $api.delete(`/leagues/${route.params.id}`)
    if (response.data.success) {
      toastStore.success('Liga eliminada exitosamente')
      router.push('/leagues')
    }
  } catch (error: any) {
    toastStore.error(error.response?.data?.message || 'Error al eliminar la liga')
  }
}

definePageMeta({
  layout: 'default'
})
</script>
