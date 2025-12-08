<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full animate-fade-in">
      <!-- Header -->
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Partido</h2>
        <button @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Match Info Header -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center gap-4 text-center">
          <div class="flex-1">
            <p class="font-bold text-gray-900 dark:text-white truncate">{{ match.home_team_name }}</p>
          </div>
          <span class="text-gray-400 font-bold">VS</span>
          <div class="flex-1">
            <p class="font-bold text-gray-900 dark:text-white truncate">{{ match.away_team_name }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button v-for="tab in ['resultado', 'detalles']" :key="tab" @click="activeTab = tab"
          class="flex-1 py-3 text-sm font-medium capitalize border-b-2 transition-colors relative"
          :class="activeTab === tab ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'">
          {{ tab }}
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

        <!-- RESULTADO TAB -->
        <div v-if="activeTab === 'resultado'" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wide">
                {{ match.home_team_name }}
              </label>
              <input v-model.number="formData.home_score" type="number" min="0"
                class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-center text-3xl font-bold py-3 focus:ring-2 focus:ring-primary-500 dark:text-white"
                placeholder="0" />
            </div>
            <div>
              <label
                class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wide">
                {{ match.away_team_name }}
              </label>
              <input v-model.number="formData.away_score" type="number" min="0"
                class="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-center text-3xl font-bold py-3 focus:ring-2 focus:ring-primary-500 dark:text-white"
                placeholder="0" />
            </div>
          </div>

          <!-- Status Check -->
          <div
            class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <span class="material-symbols-outlined text-lg">info</span>
            <p>Al guardar, el estado cambiará a "Finalizado" y se calculará la tabla.</p>
          </div>
        </div>

        <!-- DETALLES TAB -->
        <div v-if="activeTab === 'detalles'" class="space-y-4">
          <div>
            <label
              class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Fecha</label>
            <input v-model="formData.date" type="date"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              required />
          </div>
          <div>
            <label
              class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Hora</label>
            <input v-model="formData.time" type="time"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              required />
          </div>
          <div>
            <label
              class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Ubicación</label>
            <input v-model="formData.location" type="text"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Ej: Estadio Nacional" />
          </div>
          <div>
            <label
              class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Estado</label>
            <select v-model="formData.status"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="scheduled">Programado</option>
              <option value="live">En Vivo</option>
              <option value="finished">Finalizado</option>
              <option value="postponed">Pospuesto</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="error" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg flex gap-2">
          <span class="material-symbols-outlined text-lg">error</span>
          {{ error }}
        </div>
        <div v-if="success" class="text-sm text-green-600 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg flex gap-2">
          <span class="material-symbols-outlined text-lg">check_circle</span>
          {{ success }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <button type="button" @click="$emit('close')"
            class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold"
            :disabled="loading">
            Cancelar
          </button>
          <button type="submit"
            class="flex-1 btn-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
            :disabled="loading">
            <span v-if="loading" class="animate-spin material-symbols-outlined text-lg">progress_activity</span>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $api } = useNuxtApp()
const toastStore = useToastStore()

const props = defineProps<{
  match: any
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const activeTab = ref('resultado')
const loading = ref(false)
const error = ref('')
const success = ref('')

const formData = ref({
  home_score: props.match.home_score !== undefined ? props.match.home_score : 0,
  away_score: props.match.away_score !== undefined ? props.match.away_score : 0,
  date: '',
  time: '',
  location: props.match.location || '',
  status: props.match.status || 'scheduled'
})

// Initialize date/time from ISO string
onMounted(() => {
  if (props.match.match_date) {
    const d = new Date(props.match.match_date)
    formData.value.date = d.toISOString().split('T')[0]
    formData.value.time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const promises = []

    // 1. Update Details if tab is "detalles" or general fix logic?
    // Always update details if changed, but lets prioritize active tab context
    // Actually, safer to update details if any changed.

    // Combine Date+Time
    const combinedDateTime = new Date(`${formData.value.date}T${formData.value.time}`)

    if (activeTab.value === 'detalles') {
      promises.push($api.put(`/matches/${props.match.id}`, {
        match_date: combinedDateTime.toISOString(),
        location: formData.value.location,
        status: formData.value.status,
        round: props.match.round, // Keep existing
        referee: null
      }))
    }

    // 2. Update Score if tab is "resultado"
    if (activeTab.value === 'resultado') {
      promises.push($api.patch(`/matches/${props.match.id}/score`, {
        home_score: formData.value.home_score,
        away_score: formData.value.away_score
      }))
    }

    await Promise.all(promises)

    success.value = 'Cambios guardados correctamente'
    toastStore.success('✅ Partido actualizado')
    setTimeout(() => {
      emit('updated')
      emit('close')
    }, 1500)

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al guardar cambios'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
