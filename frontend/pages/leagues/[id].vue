<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark pb-12">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse space-y-8">
        <div class="h-64 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 h-96 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
          <div class="h-96 bg-surface-light dark:bg-surface-dark rounded-3xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="league" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Card -->
      <div
        class="relative bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden mb-8 animate-fade-in">
        <!-- Cover Image / Pattern -->
        <div class="h-40 md:h-64 relative overflow-hidden" :style="headerStyle">
          <div v-if="!league.cover_photo" class="absolute inset-0 opacity-10 dark:opacity-20"
            style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;">
          </div>
          <img v-if="league.cover_photo" :src="league.cover_photo" class="w-full h-full object-cover" />

          <!-- Gradient Overlay for text readability if cover photo exists -->
          <div v-if="league.cover_photo"
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <!-- Back Button -->
          <div class="absolute top-4 left-4 z-10">
            <button @click="goBack"
              class="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors text-white flex items-center gap-2 pr-2 md:pr-4">
              <span class="material-symbols-outlined">arrow_back</span>
              <span class="text-sm font-bold hidden md:inline">{{ $t('nav.leagues') }}</span>
            </button>
          </div>

          <!-- Actions (Top Right) -->
          <div class="absolute top-4 right-4 flex gap-2 z-10">
            <!-- Favorite -->
            <div
              class="p-2 bg-black/50 backdrop-blur-md rounded-xl hover:bg-black/70 transition-colors shadow-lg border border-white/10 flex items-center justify-center">
              <FavoriteButton type="league" :id="league.id" class="!text-white hover:!text-red-500" />
            </div>

            <template v-if="canManage">
              <button @click="editLeague"
                class="p-2 bg-black/50 backdrop-blur-md rounded-xl hover:bg-black/70 transition-colors text-white shadow-lg border border-white/10">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="deleteLeague"
                class="p-2 bg-black/50 backdrop-blur-md rounded-xl hover:bg-red-500/80 transition-colors text-red-400 hover:text-white shadow-lg border border-white/10">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </template>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="px-4 md:px-8 pb-4 md:pb-8">
          <div class="relative flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-6 -mt-10 md:-mt-16">
            <!-- Logo -->
            <div
              class="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-surface-light dark:bg-surface-dark p-1 shadow-2xl relative z-10 transition-all duration-300 mx-auto md:mx-0">
              <img :src="league.logo || `https://ui-avatars.com/api/?name=${league.name}&background=random`"
                class="w-full h-full object-cover rounded-xl bg-gray-50 dark:bg-white/5" alt="League Logo" />
            </div>

            <!-- Info -->
            <div class="flex-1 pt-1 md:pt-0 relative z-10 w-full text-center md:text-left">
              <div class="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-2">
                <h1
                  class="text-xl md:text-3xl font-display font-black text-text-primary-light dark:text-white drop-shadow-md md:drop-shadow-none">
                  {{ league.name }}
                </h1>
                <span :class="getStatusColor(league.status)"
                  class="px-3 py-1 rounded-full text-xs font-bold border border-current/20">
                  {{ getStatusText(league.status) }}
                </span>
              </div>

              <div
                class="flex flex-wrap justify-center md:justify-start items-center gap-x-4 md:gap-x-6 gap-y-2 text-xs md:text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary-600 dark:text-primary-500">sports_soccer</span>
                  {{ league.sport?.name }}
                </span>
                <span v-if="league.location" class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary-600 dark:text-primary-500">location_on</span>
                  {{ league.location }}
                </span>
              </div>
            </div>

            <!-- Quick Stats -->
            <div
              class="flex w-full md:w-auto mt-4 md:mt-0 gap-8 px-6 py-3 bg-background-light dark:bg-surface-dark-alt rounded-2xl border border-border-light dark:border-border-dark relative z-10 justify-around md:justify-start">
              <div class="text-center">
                <div class="text-2xl font-black text-text-primary-light dark:text-white">{{ tournaments?.length || 0 }}
                </div>
                <div
                  class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  {{ $t('league_details.tournaments') }}
                </div>
              </div>
              <div class="w-px bg-border-light dark:border-border-dark"></div>
              <div class="text-center">
                <div class="text-2xl font-black text-text-primary-light dark:text-white">{{ teams?.length || 0 }}</div>
                <div
                  class="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  {{ $t('league_details.teams') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Navigation/Tabs -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Custom Tabs -->
          <div
            class="grid grid-cols-2 md:flex items-center gap-2 p-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark w-full md:w-fit">
            <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
              class="px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 text-center"
              :class="activeTab === tab.value ? 'bg-primary-500 text-black shadow-lg shadow-neon' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'">
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="animate-slide-up">
            <!-- Tournaments -->
            <div v-if="activeTab === 'tournaments'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">
                  {{ $t('league_details.active_tournaments') }}
                </h3>
                <button v-if="canManage" @click="showCreateTournamentModal = true"
                  class="btn-primary flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">add</span>
                  {{ $t('league_details.new_tournament') }}
                </button>
              </div>

              <div v-if="tournaments?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TournamentCard v-for="tournament in tournaments" :key="tournament.id" :tournament="tournament"
                  @click="navigateTo(localePath(`/tournaments/${tournament.id}`))" />
              </div>
              <div v-else
                class="bg-surface-light dark:bg-surface-dark rounded-3xl p-12 text-center border border-border-light dark:border-border-dark border-dashed">
                <div
                  class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span
                    class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">emoji_events</span>
                </div>
                <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-2">
                  {{ $t('league_details.no_tournaments') }}
                </h3>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-xs mx-auto">
                  {{ $t('league_details.no_tournaments_desc') }}
                </p>
                <button v-if="canManage" @click="showCreateTournamentModal = true"
                  class="font-bold hover:underline text-primary-500 hover:text-primary-600">
                  {{ $t('league_details.create_first_tournament') }}
                </button>
              </div>
            </div>

            <!-- Teams -->
            <div v-if="activeTab === 'teams'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-text-primary-light dark:text-white">
                  {{ $t('league_details.registered_teams') }}
                </h3>
                <button v-if="authStore.isAuthenticated" @click="showCreateTeamModal = true"
                  class="btn-primary flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">group_add</span>
                  {{ $t('league_details.register_team') }}
                </button>
              </div>

              <div v-if="teams?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamCard v-for="team in teams" :key="team.id" :team="team" />
              </div>
              <div v-else
                class="bg-surface-light dark:bg-surface-dark rounded-3xl p-12 text-center border border-border-light dark:border-border-dark border-dashed">
                <div
                  class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span
                    class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">groups</span>
                </div>
                <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-2">
                  {{ $t('league_details.no_teams') }}
                </h3>
                <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6 max-w-xs mx-auto">
                  {{ $t('league_details.no_teams_desc') }}
                </p>
                <button v-if="authStore.isAuthenticated" @click="showCreateTeamModal = true"
                  class="font-bold hover:underline text-primary-500 hover:text-primary-600">
                  {{ $t('league_details.register_first_team') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Info/Sidebar -->
        <div class="space-y-6">
          <!-- About Card -->
          <div
            class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-6">
            <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-500">info</span>
              {{ $t('league_details.about') }}
            </h3>
            <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed mb-6">
              {{ league.description || $t('league_details.no_description') }}
            </p>

            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span
                  class="text-text-secondary-light dark:text-text-secondary-dark">{{ $t('league_details.created') }}</span>
                <span
                  class="font-bold text-text-primary-light dark:text-white">{{ formatDate(league.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Rules/Settings Card (If available) -->
          <div v-if="league.settings"
            class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg border border-border-light dark:border-border-dark p-6">
            <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-500">gavel</span>
              {{ $t('league_details.rules') }}
            </h3>
            <div class="space-y-3">
              <div v-if="league.settings.match_duration" class="flex items-center gap-3 text-sm">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-500/10 text-primary-600 dark:text-primary-500">
                  <span class="material-symbols-outlined text-lg">timer</span>
                </div>
                <div>
                  <div class="font-bold text-text-primary-light dark:text-white">{{ league.settings.match_duration }}
                    min</div>
                  <div class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {{ $t('league_details.match_duration') }}
                  </div>
                </div>
              </div>
              <div v-if="league.settings.players_per_team" class="flex items-center gap-3 text-sm">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-500/10 text-primary-600 dark:text-primary-500">
                  <span class="material-symbols-outlined text-lg">group</span>
                </div>
                <div>
                  <div class="font-bold text-text-primary-light dark:text-white">{{ league.settings.players_per_team }}
                  </div>
                  <div class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {{ $t('league_details.players_per_team') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateTournamentModal v-if="showCreateTournamentModal" :leagueId="parseInt(route.params.id as string)"
      @close="showCreateTournamentModal = false" @created="handleTournamentCreated" />
    <CreateTeamModal v-if="showCreateTeamModal" :leagueId="parseInt(route.params.id as string)"
      @close="showCreateTeamModal = false" @created="handleTeamCreated" />
    <EditLeagueModal v-if="showEditModal" :league="league" @close="showEditModal = false" @updated="refresh" />
    <ConfirmModal v-if="showDeleteConfirmModal" :isOpen="showDeleteConfirmModal"
      :title="$t('confirm.delete_league_title')" :message="$t('confirm.delete_league_message')"
      :confirmText="$t('confirm.delete_btn')" :cancelText="$t('confirm.cancel_btn')" :danger="true"
      @close="showDeleteConfirmModal = false" @confirm="confirmDeleteLeague" />

  </div>
</template>

<script setup lang="ts">
import CreateTournamentModal from '@/components/modals/CreateTournamentModal.vue'
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'
import EditLeagueModal from '@/components/modals/EditLeagueModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { $api } = useNuxtApp()
const localePath = useLocalePath()
const activeTab = ref('tournaments')
const showCreateTournamentModal = ref(false)
const showCreateTeamModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirmModal = ref(false)

const tabs = computed(() => [
  { value: 'tournaments', label: t('league_details.tabs.tournaments') },
  { value: 'teams', label: t('league_details.tabs.teams') }
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'inactive': 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    'finished': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  }
  return colors[status] || 'bg-gray-500/10 text-gray-600'
}

const getStatusText = (status: string) => {
  return t(`league_details.status.${status}`)
}

// Fetch league
const { data: league, pending, refresh } = await useAsyncData(`league-${route.params.id}`, async () => {
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

const handleTournamentCreated = (tournamentId?: number) => {
  showCreateTournamentModal.value = false
  if (tournamentId) {
    router.push(localePath(`/tournaments/${tournamentId}`))
  } else {
    refreshTournaments()
  }
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
  showEditModal.value = true
}

const deleteLeague = () => {
  showDeleteConfirmModal.value = true
}

const goBack = () => {
  router.push(localePath('/leagues'))
}

const confirmDeleteLeague = async () => {
  try {
    const response = await $api.delete(`/leagues/${route.params.id}`)
    if (response.data.success) {
      toastStore.success('Liga eliminada exitosamente')
      router.push(localePath('/leagues'))
    }
  } catch (error: any) {
    toastStore.error(error.response?.data?.message || 'Error al eliminar la liga')
    showDeleteConfirmModal.value = false
  }
}

const headerStyle = computed(() => {
  if (league.value?.cover_photo) {
    return {}
  }
  return {
    backgroundColor: '#CCFF00' // Default Volt
  }
})

definePageMeta({
  layout: 'default'
})
</script>
