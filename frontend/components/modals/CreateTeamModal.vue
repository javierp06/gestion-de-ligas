<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
      <!-- Header -->
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-text-primary-light dark:text-white">Crear Nuevo Equipo</h2>
        <button @click="$emit('close')"
          class="text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

        <!-- League Selector (if no leagueId provided) -->
        <div v-if="!leagueId">
          <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
            Liga *
          </label>
          <div class="relative">
            <select v-model="formData.league_id" required
              class="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-text-primary-light dark:text-white appearance-none">
              <option value="" disabled>Selecciona una liga</option>
              <option v-for="league in leagues" :key="league.id" :value="league.id">
                {{ league.name }}
              </option>
            </select>
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">expand_more</span>
          </div>
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
            Nombre del Equipo *
          </label>
          <input v-model="formData.name" type="text" required
            class="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-text-primary-light dark:text-white"
            placeholder="Ej: Real Madrid FC" />
        </div>

        <!-- Nombre Corto -->
        <div>
          <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
            Nombre Corto
          </label>
          <input v-model="formData.short_name" type="text" maxlength="10"
            class="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-text-primary-light dark:text-white"
            placeholder="Ej: RMA" />
        </div>

        <!-- Colores -->
        <div>
          <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
            Colores
          </label>
          <input v-model="formData.colors" type="text"
            class="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-text-primary-light dark:text-white"
            placeholder="Ej: Blanco y Azul" />
        </div>

        <!-- Estadio -->
        <div>
          <label class="block text-sm font-bold text-text-primary-light dark:text-white mb-2">
            Estadio/Cancha
          </label>
          <input v-model="formData.stadium" type="text"
            class="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-text-primary-light dark:text-white"
            placeholder="Ej: Estadio Nacional" />
        </div>

        <!-- Error Message -->
        <div v-if="error"
          class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-bold">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
          <button type="button" @click="$emit('close')"
            class="flex-1 px-4 py-2 rounded-lg font-bold text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            :disabled="loading">
            Cancelar
          </button>
          <button type="submit"
            class="flex-1 btn-primary px-4 py-2 rounded-lg font-bold shadow-neon flex items-center justify-center gap-2"
            :disabled="loading">
            <span v-if="loading" class="animate-spin material-symbols-outlined text-sm">progress_activity</span>
            <span>{{ loading ? 'Creando...' : 'Crear Equipo' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $api } = useNuxtApp()

const props = defineProps<{
  leagueId?: number
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const formData = ref({
  league_id: '',
  name: '',
  short_name: '',
  colors: '',
  stadium: ''
})

const leagues = ref<any[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!props.leagueId) {
    await fetchLeagues()
  }
})

const fetchLeagues = async () => {
  try {
    const response = await $api.get('/leagues')
    if (response.data.success) {
      leagues.value = response.data.data
    }
  } catch (err) {
    console.error('Error fetching leagues:', err)
  }
}

const handleSubmit = async () => {
  const targetLeagueId = props.leagueId || formData.value.league_id

  if (!targetLeagueId) {
    error.value = 'Debes seleccionar una liga'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const payload: any = {
      name: formData.value.name,
      league_id: targetLeagueId,
      short_name: formData.value.short_name || null,
      colors: formData.value.colors || null,
      stadium: formData.value.stadium || null
    }

    const response = await $api.post('/teams', payload)

    if (response.data.success) {
      emit('created')
      emit('close')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear el equipo'
  } finally {
    loading.value = false
  }
}
</script>
