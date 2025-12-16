<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('create_tournament.title') }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('create_tournament.step', { current: currentStep, total: 3 }) }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('create_tournament.name') }} *
            </label>
            <input v-model="formData.name" type="text" required class="input-field"
              :placeholder="$t('create_tournament.name')" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.start_date') }} *
              </label>
              <input v-model="formData.start_date" type="date" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.end_date') }}
              </label>
              <input v-model="formData.end_date" type="date" class="input-field" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('create_tournament.description') }}
            </label>
            <textarea v-model="formData.description" rows="3" class="input-field resize-none"
              :placeholder="$t('create_tournament.description_placeholder')"></textarea>
          </div>
        </div>

        <!-- Step 2: Format Selection -->
        <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {{ $t('create_tournament.select_format') }} *
            </label>
            <div class="grid grid-cols-1 gap-4">
              <button type="button" v-for="format in formats" :key="format.value"
                @click="formData.format = format.value"
                class="p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4" :class="formData.format === format.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'">
                <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400">
                  <span class="material-symbols-outlined text-2xl">{{ format.icon }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ format.label }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ format.description }}</p>
                </div>
                <div class="ml-auto flex items-center h-full">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="formData.format === format.value ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'">
                    <div v-if="formData.format === format.value" class="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('create_tournament.max_teams') }}
            </label>
            <input v-model.number="formData.max_teams" type="number" min="2" class="input-field" placeholder="Ej: 16" />
          </div>
        </div>

        <!-- Step 3: Format Configuration -->
        <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {{ $t('create_tournament.config_title', { format: getFormatLabel(formData.format) }) }}
          </h3>

          <!-- League Settings -->
          <div v-if="formData.format === 'league'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.settings.rounds') }}
              </label>
              <input v-model.number="formData.settings.matches_per_pair" type="number" min="1" max="10"
                class="input-field" placeholder="Ej: 2" />
              <p class="text-xs text-gray-500 mt-1">
                {{ $t('create_tournament.settings.rounds_desc') }}
              </p>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <input type="checkbox" v-model="formData.settings.has_playoff" id="has_playoff"
                class="w-5 h-5 text-primary-500 rounded focus:ring-primary-500">
              <label for="has_playoff" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                {{ $t('create_tournament.settings.has_playoff') }}
              </label>
            </div>

            <div v-if="formData.settings.has_playoff"
              class="pl-8 space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('create_tournament.settings.playoff_teams') }}
                </label>
                <select v-model="formData.settings.playoff_teams" class="input-field">
                  <option :value="4">Top 4 (Semifinales)</option>
                  <option :value="6">Top 6 (Repechaje)</option>
                  <option :value="8">Top 8 (Cuartos de Final)</option>
                </select>
                <p class="text-xs text-gray-500 mt-1" v-if="formData.settings.playoff_teams === 4">
                  {{ $t('create_tournament.settings.playoff_explanation.4') }}
                </p>
                <p class="text-xs text-gray-500 mt-1" v-if="formData.settings.playoff_teams === 6">
                  {{ $t('create_tournament.settings.playoff_explanation.6') }}
                </p>
                <p class="text-xs text-gray-500 mt-1" v-if="formData.settings.playoff_teams === 8">
                  {{ $t('create_tournament.settings.playoff_explanation.8') }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('create_tournament.settings.playoff_legs') }}
                </label>
                <input v-model.number="formData.settings.playoff_legs" type="number" min="1" max="5" class="input-field"
                  placeholder="Ej: 2">
                <p class="text-xs text-gray-500 mt-1">
                  {{ $t('create_tournament.settings.playoff_legs_desc') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Group + Knockout Settings -->
          <div v-if="formData.format === 'group_knockout'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('create_tournament.settings.groups_count') }}
                </label>
                <input type="number" v-model.number="formData.settings.groups_count" min="2"
                  :max="formData.max_teams ? Math.floor(formData.max_teams / 2) : 16" class="input-field">
                <p class="text-xs text-gray-500 mt-1">
                  {{ $t('create_tournament.settings.groups_count_desc', { count: formData.settings.groups_count }) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('create_tournament.settings.advancement_count') }}
                </label>
                <input type="number" v-model.number="formData.settings.advancement_count" min="1" max="4"
                  class="input-field">
                <p class="text-xs text-gray-500 mt-1">{{ $t('create_tournament.settings.advancement_count_desc') }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.settings.group_matches') }}
              </label>
              <input type="number" v-model.number="formData.settings.group_matches" min="1" max="10" class="input-field"
                placeholder="Ej: 2">
              <p class="text-xs text-gray-500 mt-1">{{ $t('create_tournament.settings.group_matches_desc') }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.settings.knockout_legs') }}
              </label>
              <input type="number" v-model.number="formData.settings.knockout_legs" min="1" max="5" class="input-field"
                placeholder="Ej: 1">
              <p class="text-xs text-gray-500 mt-1">{{ $t('create_tournament.settings.knockout_legs_desc') }}</p>
            </div>
          </div>

          <!-- Knockout Settings -->
          <div v-if="formData.format === 'knockout'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('create_tournament.settings.knockout_legs') }}
              </label>
              <input type="number" v-model.number="formData.settings.knockout_legs" min="1" max="5" class="input-field"
                placeholder="Ej: 1">
              <p class="text-xs text-gray-500 mt-1">{{ $t('create_tournament.settings.knockout_legs_only_desc') }}
              </p>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <input type="checkbox" v-model="formData.settings.third_place_match" id="third_place"
                class="w-5 h-5 text-primary-500 rounded focus:ring-primary-500">
              <label for="third_place" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                {{ $t('create_tournament.settings.third_place') }}
              </label>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3">
            <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              {{ $t('create_tournament.info_msg') }}
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error"
          class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" v-if="currentStep > 1" @click="currentStep--"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold"
            :disabled="loading">
            {{ $t('create_tournament.buttons.back') }}
          </button>

          <button type="button" v-if="currentStep === 1" @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold">
            {{ $t('create_tournament.buttons.cancel') }}
          </button>

          <button type="button" v-if="currentStep < 3" @click="nextStep"
            class="ml-auto btn-primary px-8 py-2 rounded-lg font-bold flex items-center gap-2">
            {{ $t('create_tournament.buttons.next') }}
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <button v-else type="submit"
            class="ml-auto btn-primary px-8 py-2 rounded-lg font-bold flex items-center gap-2" :disabled="loading">
            <span v-if="loading" class="animate-spin material-symbols-outlined">progress_activity</span>
            <span>{{ loading ? $t('create_tournament.buttons.creating') : $t('create_tournament.buttons.create') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const { t } = useI18n()

const props = defineProps<{
  leagueId: number
}>()

const emit = defineEmits<{
  close: []
  created: [id?: number]
}>()

const currentStep = ref(1)

const formData = ref({
  name: '',
  format: '',
  start_date: '',
  end_date: '',
  max_teams: null as number | null,
  description: '',
  settings: {
    matches_per_pair: 2,
    has_playoff: false,
    playoff_teams: 4,
    playoff_legs: 2,
    groups_count: 4,
    advancement_count: 2,
    group_matches: 2,
    knockout_legs: 1,
    third_place_match: false
  }
})

const formats = computed(() => [
  {
    value: 'league',
    label: t('components.tournament_card.formats.league'),
    icon: 'format_list_numbered',
    description: t('create_tournament.formats.league_desc')
  },
  {
    value: 'knockout',
    label: t('components.tournament_card.formats.knockout'),
    icon: 'emoji_events',
    description: t('create_tournament.formats.knockout_desc')
  }
])

const getFormatLabel = (value: string) => {
  return formats.value.find(f => f.value === value)?.label || value
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.value.name || !formData.value.start_date) {
      error.value = 'Por favor completa los campos obligatorios.'
      return
    }
  } else if (currentStep.value === 2) {
    if (!formData.value.format) {
      error.value = 'Por favor selecciona un formato.'
      return
    }
  }
  error.value = ''
  currentStep.value++
}

const loading = ref(false)
const error = ref('')

const toastStore = useToastStore()

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const payload: any = {
      name: formData.value.name,
      league_id: props.leagueId,
      format: formData.value.format,
      start_date: formData.value.start_date,
      description: formData.value.description || null,
      settings: formData.value.settings
    }

    if (formData.value.end_date) {
      payload.end_date = formData.value.end_date
    }

    if (formData.value.max_teams) {
      payload.max_teams = formData.value.max_teams
    }

    const response = await $api.post('/tournaments', payload)

    if (response.data.success) {
      toastStore.success(`Torneo "${formData.value.name}" creado exitosamente 🏆`)
      emit('created', response.data.data.id)
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear el torneo'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
