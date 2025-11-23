<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Nuevo Torneo</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Torneo *
          </label>
          <input 
            v-model="formData.name"
            type="text"
            required
            class="input-field"
            placeholder="Ej: Torneo Apertura 2024"
          />
        </div>

        <!-- Formato -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Formato *
          </label>
          <select v-model="formData.format" required class="input-field">
            <option value="">Selecciona un formato</option>
            <option value="league">Liga (todos contra todos)</option>
            <option value="knockout">Eliminación Directa</option>
            <option value="group_knockout">Grupos + Eliminación</option>
          </select>
        </div>

        <!-- Fechas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Inicio *
            </label>
            <input 
              v-model="formData.start_date"
              type="date"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Fin
            </label>
            <input 
              v-model="formData.end_date"
              type="date"
              class="input-field"
            />
          </div>
        </div>

        <!-- Max Teams -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Máximo de Equipos
          </label>
          <input 
            v-model.number="formData.max_teams"
            type="number"
            min="2"
            class="input-field"
            placeholder="Ej: 16"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea 
            v-model="formData.description"
            rows="4"
            class="input-field resize-none"
            placeholder="Describe el torneo, premios, reglas especiales, etc."
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="flex-1 btn-primary flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <span v-if="loading" class="animate-spin material-symbols-outlined">progress_activity</span>
            <span>{{ loading ? 'Creando...' : 'Crear Torneo' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const props = defineProps<{
  leagueId: number
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const formData = ref({
  name: '',
  format: '',
  start_date: '',
  end_date: '',
  max_teams: null as number | null,
  description: ''
})

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
      description: formData.value.description || null
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
      emit('created')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear el torneo'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
