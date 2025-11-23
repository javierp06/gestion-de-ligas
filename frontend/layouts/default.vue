<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-50 glass">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-8 h-8 bg-primary-500 text-black flex items-center justify-center rounded font-bold text-xl transform group-hover:rotate-12 transition-transform">
              P
            </div>
            <h2 class="text-xl font-display font-bold text-text-primary-light dark:text-white tracking-tight">
              PRO<span class="text-primary-500">LEAGUE</span>
            </h2>
          </NuxtLink>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink v-for="item in [
              { key: 'nav.home', path: '/' },
              { key: 'nav.leagues', path: '/leagues' },
              { key: 'nav.tournaments', path: '/tournaments' },
              { key: 'nav.teams', path: '/teams' },
              { key: 'nav.matches', path: '/matches' } // Note: 'matches' key needs to be added to locales if not present, or use a generic one
            ]" :key="item.key" :to="item.path"
              class="text-sm font-bold uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
              {{ $t(item.key) }}
            </NuxtLink>
          </nav>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="relative">
              <button @click="showLangDropdown = !showLangDropdown"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                <span class="material-symbols-outlined">language</span>
                <span class="text-xs font-bold uppercase">{{ locale }}</span>
              </button>

              <div v-if="showLangDropdown" @click="showLangDropdown = false"
                class="absolute right-0 mt-2 w-40 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark py-2 z-50 overflow-hidden">
                <button v-for="l in availableLocales" :key="l.code" @click="setLocale(l.code)"
                  class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                  :class="locale === l.code ? 'text-primary-500' : 'text-text-secondary-light dark:text-text-secondary-dark'">
                  <span class="uppercase">{{ l.code }}</span>
                  <span>{{ l.name }}</span>
                </button>
              </div>
            </div>

            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
              <span class="material-symbols-outlined">
                {{ isDark ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <!-- Auth Buttons -->
            <template v-if="authStore.isAuthenticated">
              <div class="relative">
                <button @click="showDropdown = !showDropdown"
                  class="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border border-border-light dark:border-border-dark hover:border-primary-500 transition-colors bg-surface-light dark:bg-surface-dark-alt">
                  <span class="text-sm font-bold text-text-primary-light dark:text-white hidden sm:block">
                    {{ authStore.user?.name }}
                  </span>
                  <div
                    class="w-8 h-8 rounded-full bg-primary-500 text-black flex items-center justify-center font-bold text-sm">
                    {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div v-if="showDropdown" @click="showDropdown = false"
                  class="absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark py-2 z-50 overflow-hidden">
                  <div class="px-4 py-3 border-b border-border-light dark:border-border-dark mb-2">
                    <p
                      class="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider font-bold">
                      Cuenta</p>
                    <p class="text-sm font-bold text-text-primary-light dark:text-white truncate">
                      {{ authStore.user?.email }}
                    </p>
                  </div>

                  <NuxtLink to="/dashboard"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span class="material-symbols-outlined text-xl">dashboard</span>
                    <span>Dashboard</span>
                  </NuxtLink>

                  <NuxtLink to="/profile"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <span class="material-symbols-outlined text-xl">person</span>
                    <span>Perfil</span>
                  </NuxtLink>

                  <div class="border-t border-border-light dark:border-border-dark my-2"></div>

                  <button @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span class="material-symbols-outlined text-xl">logout</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/login"
                class="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors">
                INICIAR SESIÓN
              </NuxtLink>
              <NuxtLink to="/register"
                class="btn-primary px-6 py-2 rounded-lg text-sm font-bold tracking-wide shadow-neon hover:scale-105 transition-transform">
                REGISTRARSE
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark mt-20">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-500 text-black flex items-center justify-center rounded font-bold text-xl">
              P
            </div>
            <span class="text-xl font-display font-bold text-text-primary-light dark:text-white tracking-tight">
              PRO<span class="text-primary-500">LEAGUE</span>
            </span>
          </div>

          <div class="flex gap-8 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            <a href="#" class="hover:text-primary-500 transition-colors">Términos</a>
            <a href="#" class="hover:text-primary-500 transition-colors">Privacidad</a>
            <a href="#" class="hover:text-primary-500 transition-colors">Contacto</a>
          </div>

          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            © 2024 ProLeague. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <LinearProgress />
    <NetworkStatus />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const { locale, locales, setLocale } = useI18n();
const showDropdown = ref(false);
const showLangDropdown = ref(false);
const isDark = ref(false);

const availableLocales = computed(() => {
  return (locales.value as any[]).filter(i => i.code !== locale.value)
});

// Check initial dark mode state
onMounted(() => {
  if (typeof window !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark');
  }
});

const toggleDarkMode = () => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark');
    isDark.value = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark.value ? 'true' : 'false');
  }
};

const handleLogout = async () => {
  showDropdown.value = false;
  await authStore.logout();
  router.push('/');
};

// Close dropdown when clicking outside
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.relative')) {
        showDropdown.value = false;
        showLangDropdown.value = false;
      }
    });
  }
});
</script>
