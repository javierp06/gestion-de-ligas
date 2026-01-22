<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 relative overflow-hidden">

    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]">
      </div>
    </div>

    <div class="max-w-md w-full relative z-10">

      <div class="text-center mb-8">
        <NuxtLink to="/"
          class="inline-flex items-center justify-center w-20 h-20 bg-primary-500 text-black rounded-2xl mb-6 shadow-neon transform hover:rotate-12 transition-transform duration-300 group">
          <span class="font-display font-black text-4xl">P</span>
        </NuxtLink>
        <h1 class="text-4xl font-display font-black text-text-primary-light dark:text-white mb-2 tracking-tight">
          PRO<span class="text-primary-500">LEAGUE</span>
        </h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark font-medium">
          {{ $t('login.subtitle') }}
        </p>
      </div>


      <div
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-2xl font-bold text-text-primary-light dark:text-white mb-6 text-center uppercase tracking-wide">
          {{ $t('login.title') }}
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-5">

          <div v-if="error"
            class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ error }}</span>
          </div>


          <div>
            <label for="email"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              {{ $t('login.email') }}
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">email</span>
              <input v-model="formData.email" type="email" id="email" required
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="tu@email.com" />
            </div>
          </div>


          <div>
            <label for="password"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              {{ $t('login.password') }}
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">lock</span>
              <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" id="password" required
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-12 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 transition-colors">
                <span
                  class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>


          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer group">
              <input type="checkbox" v-model="rememberMe"
                class="rounded border-border-light dark:border-border-dark text-primary-500 focus:ring-primary-500 bg-background-light dark:bg-surface-dark-alt">
              <span
                class="ml-2 text-text-secondary-light dark:text-text-secondary-dark font-medium group-hover:text-text-primary-light dark:group-hover:text-white transition-colors">{{ $t('login.remember_me') }}</span>
            </label>
            <a href="#"
              class="text-primary-500 hover:text-primary-400 font-bold hover:underline transition-colors">{{ $t('login.forgot_password') }}</a>
          </div>


          <button type="submit" :disabled="loading"
            class="w-full bg-primary-500 text-black font-black py-4 rounded-xl shadow-neon hover:shadow-neon-strong hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-2">
            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
            <span>{{ loading ? $t('login.logging_in') : $t('login.submit').toUpperCase() }}</span>
          </button>


          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border-light dark:border-border-dark"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span
                class="px-4 bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark">{{ $t('login.continue_with') }}</span>
            </div>
          </div>

          <div class="flex justify-center mb-6">
            <ClientOnly>
              <GoogleLogin :callback="handleGoogleLogin" />
            </ClientOnly>
          </div>

          <div class="text-center">
            <p class="text-text-secondary-light dark:text-text-secondary-dark font-medium mb-3">
              {{ $t('login.no_account') }}
            </p>
            <NuxtLink to="/register"
              class="block w-full py-3 rounded-xl border-2 border-border-light dark:border-border-dark text-text-primary-light dark:text-white font-bold hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-500 dark:hover:text-primary-500 transition-all duration-300 uppercase tracking-wide">
              {{ $t('login.register_link') }}
            </NuxtLink>
          </div>
        </form>
      </div>


      <p class="text-center text-text-secondary-light dark:text-text-secondary-dark text-sm mt-8 font-medium">
        {{ $t('footer.copyright') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { GoogleLogin } from 'vue3-google-login'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { t } = useI18n()

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(formData.value.email, formData.value.password)

  if (result?.success) {
    toastStore.success(t('login.welcome_user', { name: result.user?.name }))
    await navigateTo('/dashboard')
  } else {
    error.value = result?.message || t('login.error_generic')
    toastStore.error(error.value)
  }

  loading.value = false
}

const handleGoogleLogin = async (response: any) => {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.googleLogin(response.credential)
    if (result?.success) {
      toastStore.success(t('login.welcome_user', { name: result.user?.name }))
      await navigateTo('/dashboard')
    } else {
      error.value = result?.message || t('login.error_google')
      toastStore.error(error.value)
    }
  } catch (e) {
    error.value = t('login.error_unexpected')
    toastStore.error(error.value)
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default',
  middleware: ['guest']
})
</script>
