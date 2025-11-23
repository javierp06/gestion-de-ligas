<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 relative overflow-hidden">

    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-md w-full relative z-10">

      <div class="text-center mb-8">
        <NuxtLink to="/"
          class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 text-black rounded-2xl mb-6 shadow-neon transform hover:rotate-12 transition-transform duration-300 group">
          <span class="material-symbols-outlined text-4xl">group_add</span>
        </NuxtLink>
        <h1 class="text-3xl font-display font-black text-text-primary-light dark:text-white mb-2 tracking-tight">
          Únete a <span class="text-primary-500">PROLEAGUE</span>
        </h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark font-medium">
          Comienza a gestionar tus torneos hoy
        </p>
      </div>


      <div
        class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl rounded-3xl p-8 backdrop-blur-xl">
        <h2 class="text-2xl font-bold text-text-primary-light dark:text-white mb-2 text-center uppercase tracking-wide">
          Crear Cuenta
        </h2>
        <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center mb-6 font-medium">
          Tu cuenta se creará como <strong class="text-primary-500">usuario</strong>. Serás promovido a <strong
            class="text-primary-500">organizador</strong> al crear tu primera liga.
        </p>

        <form @submit.prevent="handleRegister" class="space-y-4">

          <div v-if="error"
            class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ error }}</span>
          </div>


          <div v-if="success"
            class="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            <span>¡Registro exitoso! Redirigiendo...</span>
          </div>


          <div>
            <label for="name"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Nombre Completo *
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">person</span>
              <input v-model="formData.name" type="text" id="name" required
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="Juan Pérez" />
            </div>
          </div>


          <div>
            <label for="email"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Correo Electrónico *
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
            <label for="phone"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Teléfono
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">phone</span>
              <input v-model="formData.phone" type="tel" id="phone"
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="+504 0000-0000" />
            </div>
          </div>


          <div>
            <label for="password"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Contraseña *
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">lock</span>
              <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" id="password" required
                minlength="6"
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-12 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="••••••••" @input="checkPasswordStrength" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 transition-colors">
                <span
                  class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>

            <div class="mt-2 flex gap-1 h-1">
              <div class="flex-1 rounded-full transition-colors duration-300"
                :class="passwordStrength >= 1 ? 'bg-red-500' : 'bg-border-light dark:bg-border-dark'"></div>
              <div class="flex-1 rounded-full transition-colors duration-300"
                :class="passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-border-light dark:bg-border-dark'"></div>
              <div class="flex-1 rounded-full transition-colors duration-300"
                :class="passwordStrength >= 3 ? 'bg-primary-500' : 'bg-border-light dark:bg-border-dark'"></div>
            </div>
            <p class="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-1 font-medium text-right">
              Mínimo 6 caracteres</p>
          </div>


          <div>
            <label for="confirmPassword"
              class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
              Confirmar Contraseña *
            </label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">lock_clock</span>
              <input v-model="formData.confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirmPassword"
                required
                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
                placeholder="••••••••" />
            </div>
          </div>


          <div class="flex items-start gap-3">
            <div class="relative flex items-center">
              <input type="checkbox" v-model="acceptTerms" required
                class="peer h-5 w-5 cursor-pointer appearance-none rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-surface-dark-alt checked:border-primary-500 checked:bg-primary-500 transition-all">
              <span
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-sm font-bold">check</span>
            </div>
            <label class="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium leading-relaxed">
              Acepto los <a href="#" class="text-primary-500 hover:underline">términos y condiciones</a> y la <a
                href="#" class="text-primary-500 hover:underline">política de privacidad</a>
            </label>
          </div>


          <button type="submit" :disabled="loading || !acceptTerms"
            class="w-full bg-primary-500 text-black font-black py-4 rounded-xl shadow-neon hover:shadow-neon-strong hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-2">
            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
            <span>{{ loading ? 'Registrando...' : 'CREAR CUENTA' }}</span>
          </button>


          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border-light dark:border-border-dark"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span
                class="px-4 bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark">¿Ya
                tienes cuenta?</span>
            </div>
          </div>


          <NuxtLink to="/login"
            class="block w-full py-3 text-center rounded-xl border-2 border-border-light dark:border-border-dark text-text-primary-light dark:text-white font-bold hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-500 dark:hover:text-primary-500 transition-all duration-300 uppercase tracking-wide">
            Iniciar Sesión
          </NuxtLink>
        </form>
      </div>


      <p class="text-center text-text-secondary-light dark:text-text-secondary-dark text-sm mt-8 font-medium">
        © 2024 Pro League. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const acceptTerms = ref(false)
const passwordStrength = ref(0)

const checkPasswordStrength = () => {
  const pwd = formData.value.password
  let strength = 0
  if (pwd.length >= 6) strength++
  if (pwd.length >= 10) strength++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)) strength++
  passwordStrength.value = strength
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    toastStore.error(error.value)
    loading.value = false
    return
  }

  const result = await authStore.register({
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    password: formData.value.password
  })

  if (result?.success) {
    success.value = true
    toastStore.success('¡Cuenta creada exitosamente! Redirigiendo al login... 🎉')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } else {
    error.value = result?.message || 'Error al registrar usuario'
    toastStore.error(error.value)
  }

  loading.value = false
}

definePageMeta({
  layout: 'default',
  middleware: ['guest']
})
</script>
