<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
      <p class="text-gray-600">Gestiona ligas, torneos, equipos y más</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card text-center">
        <div class="text-4xl mb-2">🏆</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">0</h3>
        <p class="text-gray-600">Ligas Activas</p>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">🎯</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">0</h3>
        <p class="text-gray-600">Torneos</p>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">👥</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">0</h3>
        <p class="text-gray-600">Equipos</p>
      </div>
      <div class="card text-center">
        <div class="text-4xl mb-2">⚽</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">0</h3>
        <p class="text-gray-600">Partidos</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/admin/leagues" class="card hover:border-primary-500 border-2 border-transparent transition">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Ligas</h3>
            <p class="text-gray-600">Crear, editar y administrar ligas deportivas</p>
          </div>
          <div class="text-3xl">🏆</div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/tournaments" class="card hover:border-primary-500 border-2 border-transparent transition">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Torneos</h3>
            <p class="text-gray-600">Crear y configurar torneos y competiciones</p>
          </div>
          <div class="text-3xl">🎯</div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/teams" class="card hover:border-primary-500 border-2 border-transparent transition">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Equipos</h3>
            <p class="text-gray-600">Administrar equipos y jugadores</p>
          </div>
          <div class="text-3xl">👥</div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/matches" class="card hover:border-primary-500 border-2 border-transparent transition">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Partidos</h3>
            <p class="text-gray-600">Programar partidos y actualizar resultados</p>
          </div>
          <div class="text-3xl">⚽</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

// Middleware para verificar permisos
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'organizer']
});

onMounted(() => {
  if (!authStore.isOrganizer) {
    navigateTo('/');
  }
});
</script>
