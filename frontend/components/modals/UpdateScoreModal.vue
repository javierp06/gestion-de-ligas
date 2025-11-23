<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Registrar Resultado</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Match Info -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ formatDate(match.match_date) }}</p>
          <div class="flex items-center justify-center gap-4">
            <span class="font-bold text-gray-900 dark:text-white">{{ match.home_team_name }}</span>
            <span class="text-gray-400">vs</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ match.away_team_name }}</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Scores -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
              {{ match.home_team_name }}
            </label>
            <input 
              v-model.number="formData.home_score"
              type="number"
              min="0"
              required
              class="input-field text-center text-2xl font-bold"
              placeholder="0"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
              {{ match.away_team_name }}
            </label>
            <input 
              v-model.number="formData.away_score"
              type="number"
              min="0"
              required
              class="input-field text-center text-2xl font-bold"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Info Message -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex gap-2">
            <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">info</span>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Al registrar el resultado, la tabla de posiciones se actualizará automáticamente.
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded flex items-center gap-2">
          <span class="material-symbols-outlined">check_circle</span>
          <span>{{ success }}</span>
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
            <span>{{ loading ? 'Guardando...' : 'Guardar Resultado' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const props = defineProps<{
  match: any
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const formData = ref({
  home_score: props.match.home_score || 0,
  away_score: props.match.away_score || 0
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toastStore = useToastStore()

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $api.patch(`/matches/${props.match.id}/score`, {
      home_score: formData.value.home_score,
      away_score: formData.value.away_score
    })

    if (response.data.success) {
      success.value = 'Resultado registrado y tabla actualizada'
      toastStore.success('✅ Resultado registrado. Tabla de posiciones actualizada automáticamente', 4000)
      setTimeout(() => {
        emit('updated')
      }, 1500)
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al actualizar el marcador'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
