<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Jugadores</h1>
      <NuxtLink 
        to="/players/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <span class="text-xl">+</span> Nuevo Jugador
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar por nombre o número..." 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            @input="debouncedSearch"
          >
        </div>
      </div>
    </div>

    <!-- Lista de Jugadores -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <SkeletonLoader v-for="n in 8" :key="n" type="card" />
    </div>

    <div v-else-if="players.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron jugadores.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="player in players" 
        :key="player.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        @click="$router.push(`/players/${player.id}`)"
      >
        <div class="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img 
            :src="player.photo || 'https://via.placeholder.com/300x300?text=No+Image'" 
            :alt="player.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-bold backdrop-blur-sm">
            #{{ player.number || '?' }}
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1 truncate">{{ player.name }}</h3>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-2">
            <span class="font-medium">{{ player.position || 'Sin posición' }}</span>
          </div>
          
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <img 
              :src="player.team_logo || 'https://via.placeholder.com/32'" 
              class="w-6 h-6 rounded-full object-cover"
            >
            <span class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ player.team_name || 'Sin equipo' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const players = ref([]);
const loading = ref(true);
const search = ref('');

const fetchPlayers = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (search.value) params.append('search', search.value);
    
    // Asumiendo que tenemos configurado el baseURL en nuxt.config.ts o usamos un composable
    // Si no, usar useRuntimeConfig().public.apiBase
    const config = useRuntimeConfig();
    const { data } = await useFetch(`${config.public.apiBase}/players?${params.toString()}`);
    
    if (data.value && data.value.success) {
      players.value = data.value.data;
    }
  } catch (error) {
    console.error('Error fetching players:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = useDebounceFn(() => {
  fetchPlayers();
}, 500);

onMounted(() => {
  fetchPlayers();
});
</script>
