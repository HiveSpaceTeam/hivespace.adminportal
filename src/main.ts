import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'vue-final-modal/style.css'

import { createVfm } from 'vue-final-modal'
import i18n from './i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import VueApexCharts from 'vue3-apexcharts'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getCurrentUser } from '@/auth/user-manager'
import { CULTURE_TEXT, THEME_TEXT, stringToNumericCulture, numericToStringCulture, stringToNumericTheme, numericToStringTheme } from '@/types'
import { getCookie } from '@/utils/cookie'

const initializeApp = async () => {
  const app = createApp(App)
  const vfm = createVfm()
  const pinia = createPinia()

  // Install plugins
  app.use(pinia)
  app.use(vfm)
  app.use(i18n)
  app.use(VueApexCharts)

  // Initialize culture and theme before router to ensure i18n and theme are ready
  const user = await getCurrentUser()
  if (user) {
    const userStore = useUserStore()
    await userStore.fetchUserSettings()

    // Initialize culture (i18n sync is handled in the store)
    const culture = userStore.userSettings.culture
    await userStore.updateCulture(culture)

    // Initialize theme (DOM sync is handled in the store)
    const theme = userStore.userSettings.theme
    await userStore.updateTheme(theme)
  } else {
    // For unauthenticated users, read from cookies or use defaults

    // Initialize culture from cookie
    const cookieCulture = getCookie('culture')
    const cultureText = cookieCulture || CULTURE_TEXT.VIETNAMESE
    const numericCulture = stringToNumericCulture(cultureText)
    const validCultureText = numericToStringCulture(numericCulture)
    i18n.global.locale.value = validCultureText

    // Initialize theme from cookie
    const cookieTheme = getCookie('theme')
    const themeText = cookieTheme || THEME_TEXT.LIGHT
    const numericTheme = stringToNumericTheme(themeText)
    const validThemeText = numericToStringTheme(numericTheme)

    // Apply theme to DOM
    if (validThemeText === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize router after i18n is ready
  app.use(router)

  return app
}

// Initialize and mount the app
initializeApp().then((app) => {
  app.mount('#app')
})
