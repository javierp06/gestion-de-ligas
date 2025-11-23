<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Liga</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Liga *
          </label>
          <input 
            v-model="formData.name"
            type="text"
            required
            class="input-field"
            placeholder="Ej: Liga Premier de Fútbol"
          />
        </div>

        <!-- Deporte -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Deporte *
          </label>
          <select v-model="formData.sport_id" required class="input-field">
            <option value="">Selecciona un deporte</option>
            <option v-for="sport in sports" :key="sport.id" :value="sport.id">
              {{ getSportEmoji(sport.name) }} {{ sport.name }}
            </option>
          </select>
        </div>

        <!-- Ubicación -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ubicación
          </label>
          <input 
            v-model="formData.location"
            type="text"
            class="input-field"
            placeholder="Ej: Tegucigalpa, Honduras"
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
            placeholder="Describe tu liga, reglas, nivel de juego, etc."
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="wasPromoted" class="bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded flex items-start gap-2">
          <span class="material-symbols-outlined">celebration</span>
          <div>
            <p class="font-semibold">¡Felicidades! Has sido promovido a Organizador</p>
            <p class="text-sm">Ahora puedes crear y gestionar ligas y torneos.</p>
          </div>
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
            <span>{{ loading ? 'Creando...' : 'Crear Liga' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { getSportEmoji } = useSports()

const emit = defineEmits<{
  close: []
  created: []
}>()

const formData = ref({
  name: '',
  sport_id: '',
  location: '',
  description: ''
})

const loading = ref(false)
const error = ref('')
const wasPromoted = ref(false)

// Fetch sports
const { data: sports } = await useAsyncData('sports-modal', async () => {
  const response = await $api.get('/sports')
  return response.data.success ? response.data.data : []
})

const toastStore = useToastStore()

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  wasPromoted.value = false

  try {
    const response = await $api.post('/leagues', {
      name: formData.value.name,
      sport_id: parseInt(formData.value.sport_id),
      location: formData.value.location || null,
      description: formData.value.description || null
    })

    if (response.data.success) {
      // Check if user was promoted
      if (response.data.data.user_was_promoted) {
        wasPromoted.value = true
        toastStore.success('🎉 ¡Felicidades! Has sido promovido a ORGANIZADOR', 6000)
        // Update user role in store
        authStore.updateUserRole('organizer')
        // Wait a bit to show the message
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        toastStore.success(`Liga "${formData.value.name}" creada exitosamente`)
      }
      
      emit('created')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear la liga'
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
