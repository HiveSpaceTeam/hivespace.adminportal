import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/app-user'

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))
    const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
    const isLoading = ref(false)

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const currentUser = computed(() => user.value)

    // Actions
    function setUser(userData: User) {
        user.value = userData
    }

    function setTokens(accessToken: string, refToken?: string) {
        token.value = accessToken
        localStorage.setItem('token', accessToken)

        if (refToken) {
            refreshToken.value = refToken
            localStorage.setItem('refreshToken', refToken)
        }
    }

    function clearAuth() {
        user.value = null
        token.value = null
        refreshToken.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
    }

    function setLoading(loading: boolean) {
        isLoading.value = loading
    }

    async function login(credentials: { email: string; password: string }) {
        setLoading(true)
        try {
            const { authService } = await import('@/services/auth.service')
            const response = await authService.login(credentials)

            setTokens(response.accessToken, response.refreshToken)
            setUser(response.user)

            return response
        } catch (error) {
            console.error('Login error:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        setLoading(true)
        try {
            const { authService } = await import('@/services/auth.service')
            await authService.logout()
            clearAuth()
        } catch (error) {
            console.error('Logout error:', error)
            // Clear auth even if API call fails
            clearAuth()
        } finally {
            setLoading(false)
        }
    }

    async function refreshAccessToken() {
        if (!refreshToken.value) {
            throw new Error('No refresh token available')
        }

        try {
            const { authService } = await import('@/services/auth.service')
            const response = await authService.refreshToken(refreshToken.value)

            setTokens(response.accessToken)

            return response
        } catch (error) {
            clearAuth()
            throw error
        }
    }

    return {
        // State
        user,
        token,
        refreshToken,
        isLoading,
        // Getters
        isAuthenticated,
        currentUser,
        // Actions
        setUser,
        setTokens,
        clearAuth,
        setLoading,
        login,
        logout,
        refreshAccessToken
    }
})
