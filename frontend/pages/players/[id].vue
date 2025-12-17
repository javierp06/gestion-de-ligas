<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!player" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300">Jugador no encontrado</h2>
      <button @click="$router.push('/players')" class="mt-4 text-blue-600 hover:underline">Volver a la lista</button>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Header / Actions -->
      <div class="flex justify-between items-center mb-6">
        <button 
          @click="$router.back()" 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2"
        >
          ← Volver
        </button>
        
        <div v-if="canEdit" class="flex gap-2">
          <button 
            v-if="!isEditing"
            @click="isEditing = true"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            ✏️ Editar
          </button>
          <div v-else class="flex gap-2">
            <button 
              @click="cancelEdit"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="saveChanges"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              💾 Guardar
            </button>
          </div>
          
          <button 
            @click="deletePlayer"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Columna Izquierda: Foto y Datos Básicos -->
        <div class="md:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 text-center">
            <div class="relative inline-block mb-4">
              <img 
                :src="form.photo || player.photo || 'https://via.placeholder.com/300x300?text=No+Image'" 
                :alt="player.name"
                class="w-48 h-48 object-cover rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-md mx-auto"
              >
              <div v-if="player.number" class="absolute bottom-2 right-2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-800">
                {{ isEditing ? form.number : player.number }}
              </div>
            </div>

            <div v-if="isEditing" class="space-y-4">
              <input v-model="form.photo" type="url" placeholder="URL Foto" class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
              <input v-model="form.number" type="number" placeholder="Número" class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center font-bold">
            </div>
            
            <h2 v-if="!isEditing" class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ player.name }}</h2>
            <input v-else v-model="form.name" type="text" class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center font-bold text-xl mb-2">

            <p v-if="!isEditing" class="text-gray-500 dark:text-gray-400 font-medium">{{ player.position }}</p>
            <select v-else v-model="form.position" class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2">
               <option value="Portero">Portero</option>
               <option value="Defensa">Defensa</option>
               <option value="Mediocampista">Mediocampista</option>
               <option value="Delantero">Delantero</option>
            </select>

            <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-center gap-3">
                <img :src="player.team_logo || 'https://via.placeholder.com/40'" class="w-10 h-10 rounded-full">
                <div class="text-left">
                  <p class="text-xs text-gray-500 uppercase">Equipo Actual</p>
                  <p v-if="!isEditing" class="font-bold text-gray-800 dark:text-white">{{ player.team_name }}</p>
                  <select v-else v-model="form.team_id" class="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm">
                    <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Estadísticas y Detalles -->
        <div class="md:col-span-2 space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
              <p class="text-3xl font-bold text-blue-600">{{ player.stats?.matches_played || 0 }}</p>
              <p class="text-xs text-gray-500 uppercase font-bold mt-1">Partidos</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
              <p class="text-3xl font-bold text-green-600">{{ player.stats?.total_goals || 0 }}</p>
              <p class="text-xs text-gray-500 uppercase font-bold mt-1">Goles</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
              <p class="text-3xl font-bold text-purple-600">{{ player.stats?.total_assists || 0 }}</p>
              <p class="text-xs text-gray-500 uppercase font-bold mt-1">Asistencias</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
              <p class="text-3xl font-bold text-yellow-600">{{ player.stats?.total_yellow_cards || 0 }}</p>
              <p class="text-xs text-gray-500 uppercase font-bold mt-1">Tarjetas A.</p>
            </div>
          </div>

          <!-- Información Adicional -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">Información Personal</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha de Nacimiento</p>
                <p v-if="!isEditing" class="font-medium text-gray-800 dark:text-white">
                  {{ player.birth_date ? new Date(player.birth_date).toLocaleDateString() : 'No registrada' }}
                </p>
                <input v-else v-model="form.birth_date" type="date" class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Liga</p>
                <p class="font-medium text-gray-800 dark:text-white">{{ player.league_name || 'Sin liga' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore as useToast } from '@/stores/toast';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const config = useRuntimeConfig();

const player = ref(null);
const loading = ref(true);
const isEditing = ref(false);
const teams = ref([]);

const form = ref({});

const canEdit = computed(() => auth.isAuthenticated); // Simplificado, idealmente verificar rol/ownership

const fetchPlayer = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch(`${config.public.apiBase}/players/${route.params.id}`);
    if (data.value && data.value.success) {
      player.value = data.value.data;
      // Inicializar form
      form.value = { ...player.value };
      // Formatear fecha para input date si existe
      if (form.value.birth_date) {
        form.value.birth_date = new Date(form.value.birth_date).toISOString().split('T')[0];
      }
    } else {
      player.value = null;
    }
  } catch (error) {
    console.error('Error fetching player:', error);
    toast.error('Error al cargar jugador');
  } finally {
    loading.value = false;
  }
};

const fetchTeams = async () => {
  try {
    const { data } = await useFetch(`${config.public.apiBase}/teams`);
    if (data.value && data.value.success) {
      teams.value = data.value.data;
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
};

const saveChanges = async () => {
  try {
    const { data, error } = await useFetch(`${config.public.apiBase}/players/${player.value.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: form.value
    });

    if (error.value) throw new Error(error.value.data?.message || 'Error al actualizar');

    toast.success('Jugador actualizado');
    isEditing.value = false;
    fetchPlayer(); // Recargar datos
  } catch (error) {
    toast.error(error.message);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  form.value = { ...player.value };
  if (form.value.birth_date) {
    form.value.birth_date = new Date(form.value.birth_date).toISOString().split('T')[0];
  }
};

const deletePlayer = async () => {
  if (!confirm('¿Estás seguro de eliminar este jugador?')) return;

  try {
    const { error } = await useFetch(`${config.public.apiBase}/players/${player.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    if (error.value) throw new Error(error.value.data?.message || 'Error al eliminar');

    toast.success('Jugador eliminado');
    router.push('/players');
  } catch (error) {
    toast.error(error.message);
  }
};

onMounted(() => {
  fetchPlayer();
  fetchTeams();
});
</script>
