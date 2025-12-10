<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-50 glass">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
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
              { key: 'nav.matches', path: '/matches' }
            ]" :key="item.key" :to="localePath(item.path)"
              class="text-sm font-bold uppercase tracking-wide transition-colors" active-class="text-primary-500"
              :class="route.path === localePath(item.path) ? 'text-primary-500' : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-500'">
              {{ $t(item.key) }}
            </NuxtLink>
          </nav>

          <!-- Search Bar -->
          <div class="hidden lg:flex items-center relative mx-4">
            <span
              class="material-symbols-outlined absolute left-3 text-text-secondary-light dark:text-text-secondary-dark">search</span>
            <input type="text" :placeholder="$t('nav.search_placeholder')"
              class="bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all w-48 focus:w-64 text-text-primary-light dark:text-white" />
          </div>

          <!-- Right Side Actions -->
          <div class="hidden md:flex items-center gap-4">
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
                <div v-if="showDropdown"
                  class="absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark py-2 z-50 overflow-hidden">
                  <div class="px-4 py-3 border-b border-border-light dark:border-border-dark mb-2">
                    <p
                      class="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider font-bold">
                      {{ $t('user_menu.account') }}
                    </p>
                    <p class="text-sm font-bold text-text-primary-light dark:text-white truncate">
                      {{ authStore.user?.email }}
                    </p>
                  </div>
                  <button @click="navigateAndClose('/dashboard')"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
                    <span class="material-symbols-outlined text-xl">dashboard</span>
                    <span>{{ $t('user_menu.dashboard') }}</span>
                  </button>

                  <button @click="navigateAndClose('/profile')"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
                    <span class="material-symbols-outlined text-xl">person</span>
                    <span>{{ $t('user_menu.profile') }}</span>
                  </button>

                  <div class="border-t border-border-light dark:border-border-dark my-2"></div>

                  <button @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span class="material-symbols-outlined text-xl">logout</span>
                    <span>{{ $t('user_menu.logout') }}</span>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink :to="localePath('/login')"
                class="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors">
                {{ $t('nav.login').toUpperCase() }}
              </NuxtLink>
              <NuxtLink :to="localePath('/register')"
                class="btn-primary px-6 py-2 rounded-lg text-sm font-bold tracking-wide shadow-neon hover:scale-105 transition-transform">
                {{ $t('nav.register').toUpperCase() }}
              </NuxtLink>
            </template>
          </div>
          <!-- Mobile Menu Toggle -->
          <button @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark">
            <span class="material-symbols-outlined">{{ showMobileMenu ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
      <!-- Mobile Menu -->
      <div v-show="showMobileMenu"
        class="md:hidden absolute top-16 left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-2xl animate-fade-in px-4 py-6 flex flex-col gap-4 max-h-[calc(100vh-4rem)] overflow-y-auto">

        <!-- Mobile Navigation Links -->
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="item in [
            { key: 'nav.home', path: '/' },
            { key: 'nav.leagues', path: '/leagues' },
            { key: 'nav.tournaments', path: '/tournaments' },
            { key: 'nav.matches', path: '/matches' }
          ]" :key="item.key" :to="localePath(item.path)" @click="showMobileMenu = false"
            class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3"
            :class="route.path === localePath(item.path) ? 'bg-primary-500/10 text-primary-600 dark:text-primary-500' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/5'">
            <!-- Icons for mobile menu -->
            <span class="material-symbols-outlined" v-if="item.key === 'nav.home'">home</span>
            <span class="material-symbols-outlined" v-if="item.key === 'nav.leagues'">emoji_events</span>
            <span class="material-symbols-outlined" v-if="item.key === 'nav.tournaments'">trophy</span>
            <span class="material-symbols-outlined" v-if="item.key === 'nav.teams'">groups</span>
            <span class="material-symbols-outlined" v-if="item.key === 'nav.matches'">sports_soccer</span>
            {{ $t(item.key) }}
          </NuxtLink>
        </nav>

        <div class="h-px bg-border-light dark:border-border-dark my-2"></div>

        <!-- Mobile Auth/Account Links -->
        <template v-if="authStore.isAuthenticated">
          <div class="flex flex-col gap-2">
            <div class="px-3 py-2 flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-primary-500 text-black flex items-center justify-center font-bold text-sm">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
              <div class="flex flex-col">
                <span
                  class="text-sm font-bold text-text-primary-light dark:text-white">{{ authStore.user?.name }}</span>
                <span
                  class="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate max-w-[150px]">{{ authStore.user?.email }}</span>
              </div>
            </div>

            <button @click="navigateAndClose('/dashboard')"
              class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/5">
              <span class="material-symbols-outlined">dashboard</span>
              <span>{{ $t('user_menu.dashboard') }}</span>
            </button>

            <button @click="navigateAndClose('/profile')"
              class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/5">
              <span class="material-symbols-outlined">person</span>
              <span>{{ $t('user_menu.profile') }}</span>
            </button>

            <button @click="handleLogout"
              class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <span class="material-symbols-outlined">logout</span>
              <span>{{ $t('user_menu.logout') }}</span>
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-2">
            <NuxtLink :to="localePath('/login')" @click="showMobileMenu = false"
              class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-white/5">
              <span class="material-symbols-outlined">login</span>
              <span>{{ $t('nav.login') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/register')" @click="showMobileMenu = false"
              class="p-3 rounded-xl text-base font-bold transition-colors flex items-center gap-3 text-primary-600 dark:text-primary-500 bg-primary-500/10">
              <span class="material-symbols-outlined">person_add</span>
              <span>{{ $t('nav.register') }}</span>
            </NuxtLink>
          </div>
        </template>

        <div class="h-px bg-border-light dark:border-border-dark my-2"></div>

        <!-- Mobile Search -->
        <div class="relative">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">search</span>
          <input type="text" :placeholder="$t('nav.search_placeholder')"
            class="w-full bg-surface-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-text-primary-light dark:text-white" />
        </div>

        <div class="h-px bg-border-light dark:border-border-dark my-2"></div>

        <div class="flex items-center gap-4 justify-between mt-2">
          <!-- Language Switcher -->
          <div class="relative">
            <button @click="showLangDropdown = !showLangDropdown"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
              <span class="material-symbols-outlined">language</span>
              <span class="text-xs font-bold uppercase">{{ locale }}</span>
            </button>

            <div v-if="showLangDropdown" @click="showLangDropdown = false"
              class="absolute left-0 bottom-full mb-2 w-40 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark py-2 z-50 overflow-hidden">
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
        </div>
      </div>
    </header>

    <!-- Mobile Quick Navigation (Secondary Header) -->
    <div
      class="md:hidden sticky top-16 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark overflow-x-auto scrollbar-hide">
      <div class="flex items-center gap-2 px-4 py-2 min-w-max">
        <NuxtLink v-for="item in [
          { key: 'nav.leagues', path: '/leagues', icon: 'emoji_events' },
          { key: 'nav.tournaments', path: '/tournaments', icon: 'trophy' },
          { key: 'nav.matches', path: '/matches', icon: 'sports_soccer' }
        ]" :key="item.key" :to="localePath(item.path)"
          class="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border"
          :class="route.path === localePath(item.path)
            ? 'bg-primary-500 text-black border-primary-500 shadow-neon'
            : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark border-border-light dark:border-border-dark hover:border-primary-500 hover:text-primary-500'">
          <span class="material-symbols-outlined text-[18px]">{{ item.icon }}</span>
          {{ $t(item.key) }}
        </NuxtLink>
      </div>
    </div>

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
            <a href="#" class="hover:text-primary-500 transition-colors">{{ $t('footer.terms') }}</a>
            <a href="#" class="hover:text-primary-500 transition-colors">{{ $t('footer.privacy') }}</a>
            <a href="#" class="hover:text-primary-500 transition-colors">{{ $t('footer.contact') }}</a>
          </div>

          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {{ $t('footer.copyright') }}
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#imports';
import { navigateTo } from '#app';
import { useAuthStore } from '@/stores/auth';
import { useFavoritesStore } from '@/stores/favorites';

const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const router = useRouter();
const localePath = useLocalePath();
const { locale, locales, setLocale } = useI18n();
const showDropdown = ref(false);
const showLangDropdown = ref(false);
const showMobileMenu = ref(false);
const isDark = ref(false);

const availableLocales = computed(() => {
  return (locales.value as any[]).filter(i => i.code !== locale.value)
});

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('darkMode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'true' || (!storedTheme && systemDark)) {
      document.documentElement.classList.add('dark');
      isDark.value = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDark.value = false;
    }
  }

  // Fetch favorites if authenticated
  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavorites();
  }
});

// Watch for authentication changes
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await favoritesStore.fetchFavorites();
  } else {
    // Clear favorites
    favoritesStore.leagues = [];
    favoritesStore.teams = [];
    favoritesStore.tournaments = [];
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
  router.push(localePath('/'));
};

const navigateAndClose = (path: string) => {
  showDropdown.value = false;
  navigateTo(localePath(path));
};

const route = useRoute();

watch(() => route.fullPath, () => {
  showDropdown.value = false;
  showLangDropdown.value = false;
  showMobileMenu.value = false;
});

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
