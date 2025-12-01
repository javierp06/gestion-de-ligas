<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <button 
          @click="$router.back()" 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2"
        >
          ← Volver
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registrar Nuevo Jugador</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. Lionel Messi"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Número -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Camiseta</label>
              <input 
                v-model="form.number" 
                type="number" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej. 10"
              >
            </div>

            <!-- Posición -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posición</label>
              <select 
                v-model="form.position"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccionar posición</option>
                <option value="Portero">Portero</option>
                <option value="Defensa">Defensa</option>
                <option value="Mediocampista">Mediocampista</option>
                <option value="Delantero">Delantero</option>
                <option value="Base">Base</option>
                <option value="Escolta">Escolta</option>
                <option value="Alero">Alero</option>
                <option value="Ala-Pívot">Ala-Pívot</option>
                <option value="Pívot">Pívot</option>
              </select>
            </div>
          </div>

          <!-- Equipo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipo</label>
            <select 
              v-model="form.team_id"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>Seleccionar equipo</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
            <p v-if="teams.length === 0" class="text-sm text-yellow-600 mt-1">
              No hay equipos disponibles. Crea un equipo primero.
            </p>
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Nacimiento</label>
            <input 
              v-model="form.birth_date" 
              type="date" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
          </div>

          <!-- Foto URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de la Foto</label>
            <input 
              v-model="form.photo" 
              type="url" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://ejemplo.com/foto.jpg"
            >
          </div>

          <!-- Preview -->
          <div v-if="form.photo" class="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <img :src="form.photo" alt="Preview" class="h-32 w-32 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md">
          </div>

          <!-- Botones -->
          <div class="flex gap-4 pt-4">
            <button 
              type="button" 
              @click="$router.back()"
              class="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              <span v-if="loading" class="animate-spin mr-2">⚪</span>
              {{ loading ? 'Guardando...' : 'Crear Jugador' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '@/stores/toast';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const config = useRuntimeConfig();

const loading = ref(false);
const teams = ref([]);

const form = ref({
  name: '',
  number: '',
  position: '',
  team_id: '',
  birth_date: '',
  photo: ''
});

const fetchTeams = async () => {
  try {
    // Asumiendo que existe un endpoint de equipos
    const { data } = await useFetch(`${config.public.apiBase}/teams`);
    if (data.value && data.value.success) {
      teams.value = data.value.data;
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    toast.error('Error al cargar equipos');
  }
};

const handleSubmit = async () => {
  if (!auth.isAuthenticated) {
    toast.error('Debes iniciar sesión para crear jugadores');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const { data, error } = await useFetch(`${config.public.apiBase}/players`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      body: form.value
    });

    if (error.value) {
      throw new Error(error.value.data?.message || 'Error al crear jugador');
    }

    toast.success('Jugador creado exitosamente');
    router.push('/players');
  } catch (error) {
    console.error('Error creating player:', error);
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTeams();
});
</script>
