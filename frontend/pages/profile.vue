<template>
    <div class="min-h-screen bg-background-light dark:bg-background-dark py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header Profile Card -->
            <div
                class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-900 p-8 mb-8 shadow-xl animate-fade-in">
                <!-- Background Pattern -->
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2">
                </div>

                <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div class="relative group">
                        <div
                            class="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center text-4xl font-bold text-white shadow-2xl overflow-hidden">
                            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Profile"
                                class="w-full h-full object-cover" />
                            <span v-else>{{ authStore.user?.name?.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div
                            class="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-primary-800">
                        </div>
                    </div>

                    <div class="text-center md:text-left flex-1">
                        <h1 class="text-3xl font-display font-black text-white mb-2 tracking-tight">
                            {{ authStore.user?.name }}
                        </h1>
                        <p class="text-primary-100 text-lg mb-4 font-medium">
                            {{ authStore.user?.email }}
                        </p>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3">
                            <span
                                class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wide">
                                <span class="material-symbols-outlined text-lg">badge</span>
                                {{ getRoleText(authStore.user?.role || 'user') }}
                            </span>
                            <span v-if="authStore.user?.phone"
                                class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                                <span class="material-symbols-outlined text-lg">phone</span>
                                {{ authStore.user?.phone }}
                            </span>
                            <span v-if="authStore.user?.created_at"
                                class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                                <span class="material-symbols-outlined text-lg">calendar_month</span>
                                {{ $t('profile_page.member_since', {
                                    year: new
                                        Date(authStore.user.created_at).getFullYear()
                                }) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Sidebar Navigation -->
                <div class="lg:col-span-1 space-y-6">
                    <div
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-6 animate-slide-up">
                        <h3 class="text-lg font-bold text-text-primary-light dark:text-white mb-4 px-2">
                            {{ $t('profile_page.settings') }}
                        </h3>
                        <nav class="space-y-2">
                            <button @click="activeTab = 'general'"
                                :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left',
                                    activeTab === 'general' ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/5']">
                                <span class="material-symbols-outlined">person</span>
                                {{ $t('profile_page.nav.personal_info') }}
                            </button>
                            <button @click="activeTab = 'security'"
                                :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left',
                                    activeTab === 'security' ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/5']">
                                <span class="material-symbols-outlined">lock</span>
                                {{ $t('profile_page.nav.security') }}
                            </button>
                            <button @click="activeTab = 'activity'"
                                :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left',
                                    activeTab === 'activity' ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-white/5']">
                                <span class="material-symbols-outlined">history</span>
                                {{ $t('profile_page.nav.activity') }}
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="lg:col-span-2">
                    <!-- General Info Tab -->
                    <div v-if="activeTab === 'general'"
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-fade-in">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary-500">manage_accounts</span>
                            {{ $t('profile_page.personal.title') }}
                        </h2>

                        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                            <!-- Avatar Selection -->
                            <div class="mb-8">
                                <label
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4">
                                    {{ $t('profile_page.personal.select_avatar') }}
                                </label>
                                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                                    <button v-for="avatar in availableAvatars" :key="avatar"
                                        @click.prevent="selectAvatar(avatar)" type="button"
                                        class="relative group aspect-square rounded-full overflow-hidden border-2 transition-all duration-300"
                                        :class="formData.avatar === avatar ? 'border-primary-500 scale-110 shadow-neon' : 'border-transparent hover:border-primary-300 hover:scale-105'">
                                        <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
                                        <div v-if="formData.avatar === avatar"
                                            class="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                            <span class="material-symbols-outlined text-white font-bold">check</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.personal.full_name') }}
                                    </label>
                                    <div class="relative group">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">person</span>
                                        <input v-model="formData.name" type="text" required
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.personal.location') }}
                                    </label>
                                    <div class="relative group">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">location_on</span>
                                        <input v-model="formData.location" type="text"
                                            :placeholder="$t('profile_page.personal.location_placeholder')"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.personal.phone') }}
                                    </label>
                                    <div class="flex gap-2">
                                        <div class="relative w-32">
                                            <select v-model="formData.countryCode"
                                                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 px-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium appearance-none">
                                                <option v-for="country in countryCodes" :key="country.code"
                                                    :value="country.code">
                                                    {{ country.flag }} {{ country.code }}
                                                </option>
                                            </select>
                                            <span
                                                class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark pointer-events-none text-sm">expand_more</span>
                                        </div>
                                        <div class="relative group flex-1">
                                            <span
                                                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">phone</span>
                                            <input v-model="formData.phone" type="tel" placeholder="9999-9999"
                                                class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                        </div>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.personal.bio') }}
                                    </label>
                                    <div class="relative group">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-4 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">edit_note</span>
                                        <textarea v-model="formData.bio" rows="3"
                                            :placeholder="$t('profile_page.personal.bio_placeholder')"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none"></textarea>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.personal.email') }}
                                    </label>
                                    <div class="relative">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">email</span>
                                        <input :value="authStore.user?.email" type="email" disabled
                                            class="w-full bg-background-light/50 dark:bg-surface-dark-alt/50 border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark rounded-xl py-3 pl-12 pr-4 outline-none cursor-not-allowed font-medium" />
                                        <span
                                            class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark bg-background-light dark:bg-surface-dark px-2 py-1 rounded-md border border-border-light dark:border-border-dark">
                                            {{ $t('profile_page.personal.not_editable') }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end pt-4">
                                <button type="submit" :disabled="loading"
                                    class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="loading"
                                        class="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span v-else class="material-symbols-outlined">save</span>
                                    {{ loading ? $t('profile_page.personal.saving') : $t('profile_page.personal.save')
                                    }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Security Tab -->
                    <div v-if="activeTab === 'security'"
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-fade-in">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary-500">lock_reset</span>
                            {{ $t('profile_page.security_tab.title') }}
                        </h2>

                        <form @submit.prevent="handleUpdatePassword" class="space-y-6">
                            <div>
                                <label
                                    class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                    {{ $t('profile_page.security_tab.current_password') }}
                                </label>
                                <div class="relative group">
                                    <span
                                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">lock</span>
                                    <input v-model="passwordData.currentPassword" type="password" required
                                        class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.security_tab.new_password') }}
                                    </label>
                                    <div class="relative group">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">key</span>
                                        <input v-model="passwordData.newPassword" type="password" required minlength="6"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                                        {{ $t('profile_page.security_tab.confirm_password') }}
                                    </label>
                                    <div class="relative group">
                                        <span
                                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark group-focus-within:text-primary-500 transition-colors">check_circle</span>
                                        <input v-model="passwordData.confirmPassword" type="password" required
                                            minlength="6"
                                            class="w-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark text-text-primary-light dark:text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end pt-4">
                                <button type="submit" :disabled="loading"
                                    class="btn-primary px-8 py-3 rounded-xl font-bold shadow-neon flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="loading"
                                        class="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span v-else class="material-symbols-outlined">update</span>
                                    {{ loading ? $t('profile_page.security_tab.updating') :
                                        $t('profile_page.security_tab.update') }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Activity Tab -->
                    <div v-if="activeTab === 'activity'"
                        class="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8 animate-fade-in">
                        <h2
                            class="text-2xl font-display font-bold text-text-primary-light dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary-500">history</span>
                            {{ $t('profile_page.activity_tab.title') }}
                        </h2>

                        <div v-if="activityLogs.length > 0" class="space-y-6">
                            <div v-for="(log, index) in activityLogs" :key="index" class="flex gap-4 relative">
                                <!-- Timeline Line -->
                                <div v-if="index !== activityLogs.length - 1"
                                    class="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-border-light dark:bg-border-dark">
                                </div>

                                <div
                                    class="w-10 h-10 rounded-full bg-background-light dark:bg-surface-dark-alt border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 z-10">
                                    <span
                                        class="material-symbols-outlined text-primary-500 text-sm">{{ getActivityIcon(log.action) }}</span>
                                </div>

                                <div class="flex-1 pb-2">
                                    <p class="text-sm font-bold text-text-primary-light dark:text-white">
                                        {{ getActivityText(log) }}
                                    </p>
                                    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                        {{ formatDate(log.timestamp) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-else
                            class="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
                            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">history_toggle_off</span>
                            <p>{{ $t('profile_page.activity_tab.empty') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { navigateTo } from '#app'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const toastStore = useToastStore()
const { t, locale } = useI18n()
const { $api } = useNuxtApp()

const activeTab = ref('general')
const loading = ref(false)
const activityLogs = ref<any[]>([])

const formData = ref({
    name: '',
    phone: '',
    countryCode: '+504',
    avatar: '',
    bio: '',
    location: ''
})

const countryCodes = [
    { code: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+34', flag: '🇪🇸', name: 'España' },
    { code: '+52', flag: '🇲🇽', name: 'México' },
    { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '+507', flag: '🇵🇦', name: 'Panamá' }
]

const availableAvatars = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Willow',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Scooter',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Abby',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Loki',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Pepper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka'
]

const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

onMounted(async () => {
    if (authStore.user) {
        formData.value.name = authStore.user.name
        formData.value.avatar = authStore.user.avatar || ''
        formData.value.bio = authStore.user.bio || ''
        formData.value.location = authStore.user.location || ''

        // Parse phone number if exists
        if (authStore.user.phone) {
            const phone = authStore.user.phone
            const foundCode = countryCodes.find(c => phone.startsWith(c.code))
            if (foundCode) {
                formData.value.countryCode = foundCode.code
                formData.value.phone = phone.replace(foundCode.code, '').trim()
            } else {
                formData.value.phone = phone
            }
        }
    }
    await fetchActivityLogs()
})

const selectAvatar = (avatar: string) => {
    formData.value.avatar = avatar
}

const fetchActivityLogs = async () => {
    try {
        const response = await $api.get('/auth/activity')
        if (response.data.success) {
            activityLogs.value = response.data.data
        }
    } catch (error) {
        console.error('Error fetching activity logs:', error)
    }
}

const getActivityIcon = (action: string) => {
    switch (action) {
        case 'login': return 'login'
        case 'logout': return 'logout'
        case 'create': return 'add_circle'
        case 'update': return 'edit'
        case 'delete': return 'delete'
        case 'register': return 'person_add'
        case 'update_profile': return 'manage_accounts'
        default: return 'info'
    }
}

const getActivityText = (log: any) => {
    if (log.action === 'login') return t('profile_page.activity_logs.login');
    if (log.action === 'logout') return t('profile_page.activity_logs.logout');
    if (log.action === 'update_profile') return t('profile_page.activity_logs.update_profile');

    const action = t(`profile_page.activity_logs.actions.${log.action}`) || log.action;
    const resource = t(`profile_page.activity_logs.resources.${log.resource}`) || log.resource;

    // Use a simple concatenation with a translation key for structure if preferred,
    // but typically "Action of Resource" works in many languages, or "Resource Action".
    // For now, let's stick to simple concatenation or just "$t('action_of', {action, resource})"
    // Since I didn't add a generic key, I'll construct it in Spanish/English logic or add it.
    // Actually, I should probably add a key for "{action} of {resource}" but for now
    // let's assume "Action de Resource" format or similar.
    // Ideally: t('profile_page.activity_logs.action_description', { action, resource })
    // Let's check my JSON update... I didn't add a generic pattern.
    // I'll just return `${action} - ${resource}` which is neutral.
    return `${action} - ${resource}`
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getRoleText = (role: string) => {
    return t(`roles.${role}`) || role
}

const handleUpdateProfile = async () => {
    loading.value = true

    // Combine country code and phone
    const fullPhone = formData.value.phone ? `${formData.value.countryCode} ${formData.value.phone}` : ''

    try {
        const result = await authStore.updateProfile({
            name: formData.value.name,
            phone: fullPhone,
            avatar: formData.value.avatar,
            bio: formData.value.bio,
            location: formData.value.location
        })

        if (result?.success) {
            toastStore.success(t('common.success_profile_update') || 'Perfil actualizado correctamente')
        } else {
            toastStore.error(result?.message || t('common.error_profile_update') || 'Error al actualizar perfil')
        }
    } catch (error) {
        toastStore.error(t('common.error_profile_update') || 'Error al actualizar perfil')
    } finally {
        loading.value = false
    }
}

const handleUpdatePassword = async () => {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        toastStore.error(t('common.passwords_mismatch') || 'Las contraseñas no coinciden')
        return
    }

    loading.value = true
    try {
        const result = await authStore.updateProfile({
            password: passwordData.value.currentPassword,
            newPassword: passwordData.value.newPassword
        })

        if (result?.success) {
            toastStore.success(t('common.success_password_update') || 'Contraseña actualizada correctamente')
            passwordData.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        } else {
            toastStore.error(result?.message || t('common.error_password_update') || 'Error al actualizar contraseña')
        }
    } catch (error) {
        toastStore.error(t('common.error_unexpected') || 'Error inesperado')
    } finally {
        loading.value = false
    }
}

definePageMeta({
    middleware: ['auth'],
    layout: 'default'
})
</script>
