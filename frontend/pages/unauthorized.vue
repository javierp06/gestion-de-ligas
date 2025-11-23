<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-md w-full text-center">

      <div class="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
        <span class="material-symbols-outlined text-red-600 dark:text-red-400" style="font-size: 60px">block</span>
      </div>


      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('unauthorized.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ $t('unauthorized.message') }}
      </p>


      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="goBack" class="btn-primary flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">arrow_back</span>
          {{ $t('unauthorized.go_back') }}
        </button>
        <button @click="goHome"
          class="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">home</span>
          {{ $t('unauthorized.go_home') }}
        </button>
      </div>


      <div class="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
          <div class="text-left">
            <p class="font-semibold text-blue-900 dark:text-blue-300 mb-1">{{ $t('unauthorized.organizer_prompt') }}</p>
            <p class="text-sm text-blue-700 dark:text-blue-400">
              {{ $t('unauthorized.organizer_message') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}

const goHome = () => {
  navigateTo('/')
}

definePageMeta({
  layout: 'default'
})
</script>
