<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed, nextTick } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')
const isInitialized = ref(false)

const isDarkMode = computed(() => theme.value === 'dark')

const toggleTheme = () => {
  console.log('Current theme before toggle:', theme.value)
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  console.log('New theme after toggle:', theme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'light' // Default to light theme

  theme.value = initialTheme
  isInitialized.value = true
})

watch([theme, isInitialized], async ([newTheme, newIsInitialized]: [Theme, boolean]) => {
  if (newIsInitialized) {
    console.log('Theme changed to:', newTheme)
    localStorage.setItem('theme', newTheme)

    await nextTick()

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to document')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from document')
    }
    console.log('Current document classes:', document.documentElement.classList.toString())
  }
})

// Provide theme context to child components
provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>
