<template>
  <div>
    <h1></h1>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@hivespace/shared'
import { useUserStore } from '@/stores/user'
import i18n from '@/i18n'
import { numericToStringCulture } from '@/types'

const { handleLoginCallback, logout } = useAuth()
const router = useRouter()

onMounted(async () => {
  try {
    const result = await handleLoginCallback()

    let returnToUrl = '/account/user-management'
    if (result.state !== undefined) {
      returnToUrl = result.state
    }
    const userStore = useUserStore()
    const settings = await userStore.fetchUserSettings()
    i18n.global.locale.value = numericToStringCulture(settings.culture)
    router.push({ path: returnToUrl })
  } catch (error) {
    // Handle error, e.g., redirect to error page or show message
    await logout()
    console.error('Callback error:', error)
  }
})
</script>
