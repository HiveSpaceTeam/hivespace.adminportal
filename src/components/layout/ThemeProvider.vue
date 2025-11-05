<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getCurrentUser } from '@/auth/user-manager'
import { THEME_TEXT, stringToNumericTheme } from '@/types'
import { setCookie } from '@/utils/cookie'

interface ThemeContext {
  isDarkMode: ReturnType<typeof computed<boolean>>
  toggleTheme: () => Promise<void>
}

const userStore = useUserStore()

const isDarkMode = computed(() => userStore.getCurrentTheme() === THEME_TEXT.DARK)

const toggleTheme = async () => {
  debugger
  const currentTheme = userStore.getCurrentTheme()
  const newTheme = currentTheme === THEME_TEXT.LIGHT ? THEME_TEXT.DARK : THEME_TEXT.LIGHT
  const numericTheme = stringToNumericTheme(newTheme)

  // Check if user is authenticated
  const user = await getCurrentUser()
  if (user) {
    // For authenticated users, update through store (which calls API)
    await userStore.updateTheme(numericTheme)
  }
  setCookie('theme', newTheme, 365) // Store for 1 year

  // Apply theme to DOM
  if (newTheme === THEME_TEXT.DARK) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

provide('theme', {
  isDarkMode,
  toggleTheme,
} as ThemeContext)
</script>

<script lang="ts">
import { inject } from 'vue'

interface ThemeContext {
  isDarkMode: ReturnType<typeof computed<boolean>>
  toggleTheme: () => Promise<void>
}

export function useTheme(): ThemeContext {
  const theme = inject<ThemeContext>('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
