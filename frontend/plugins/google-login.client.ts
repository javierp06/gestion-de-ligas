import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: config.public.googleClientId || '985663130308-2sh4s4au3ugvlgui9u95okkb41irks55.apps.googleusercontent.com'
  })
})
