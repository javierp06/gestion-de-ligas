<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Nuevo Equipo</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Equipo *
          </label>
          <input 
            v-model="formData.name"
            type="text"
            required
            class="input-field"
            placeholder="Ej: Real Madrid FC"
          />
        </div>

        <!-- Nombre Corto -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre Corto
          </label>
          <input 
            v-model="formData.short_name"
            type="text"
            maxlength="10"
            class="input-field"
            placeholder="Ej: RMA"
          />
        </div>

        <!-- Colores -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Colores
          </label>
          <input 
            v-model="formData.colors"
            type="text"
            class="input-field"
            placeholder="Ej: Blanco y Azul"
          />
        </div>

        <!-- Estadio -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Estadio/Cancha
          </label>
          <input 
            v-model="formData.stadium"
            type="text"
            class="input-field"
            placeholder="Ej: Estadio Nacional"
          />
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
            <span>{{ loading ? 'Creando...' : 'Crear Equipo' }}</span>
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
  short_name: '',
  colors: '',
  stadium: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const payload: any = {
      name: formData.value.name,
      league_id: props.leagueId,
      short_name: formData.value.short_name || null,
      colors: formData.value.colors || null,
      stadium: formData.value.stadium || null
    }

    const response = await $api.post('/teams', payload)

    if (response.data.success) {
      emit('created')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear el equipo'
  } finally {
    loading.value = false
  }
}
</script>
