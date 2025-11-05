import {
  type User,
  type GetUsersParams,
  type Pagination,
  type UserSettings,
  type CultureText,
  type ThemeText,
  DEFAULT_USER_SETTINGS,
  numericToStringCulture,
  numericToStringTheme,
  Status
} from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/user.service'
import { useAppStore } from './app'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const pagination = ref<Pagination | null>(null)

  // User settings state
  const userSettings = ref<UserSettings>(DEFAULT_USER_SETTINGS)

  const setUsers = (data: User[]) => {
    users.value = data
  }

  /**
   * Fetch paginated user list from backend and update state
   */
  const fetchUsers = async (params?: GetUsersParams) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      const response = await userService.getUsers(params)
      // Response contains API-shaped User objects; store them directly
      const apiUsers = response?.users || []
      users.value = apiUsers as User[]

      pagination.value = response?.pagination || null
      return response
    } finally {
      appStore.setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      await userService.deleteUser(userId)
      // Remove user from local state
      users.value = users.value.filter((user) => user.id !== userId)
      // Update pagination total to keep UI consistent
      if (pagination.value) {
        pagination.value.totalItems = Math.max(0, pagination.value.totalItems - 1)
      }
    } finally {
      appStore.setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      const user = users.value.find((u) => u.id === userId)
      if (!user) return

      // Toggle status based on current status (1 = Active, 0 = Inactive)
      const updatedUser = await userService.updateUserStatus(userId, !(user.status === Status.Active))

      // Update user in local state
      const index = users.value.findIndex((u) => u.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    } finally {
      appStore.setLoading(false)
    }
  }

  const clearState = () => {
    setUsers([])
    pagination.value = null
  }

  // User Settings Actions
  const setUserSettings = (settings: UserSettings) => {
    userSettings.value = settings
  }

  /**
   * Fetch user settings and update state
   */
  const fetchUserSettings = async () => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      const settings = await userService.getUserSetting()
      setUserSettings(settings)
      return settings
    } catch (error) {
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  /**
   * Update user settings
   */
  const updateUserSettings = async (newSettings: UserSettings) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      await userService.setUserSetting(newSettings)
      setUserSettings(newSettings) // Update local state on success
    } catch (error) {
      throw error
    } finally {
      appStore.setLoading(false)
    }
  }

  /**
   * Update theme setting and sync with DOM
   * @param themeValue - THEME_VALUES.LIGHT for Light, THEME_VALUES.DARK for Dark
   */
  const updateTheme = async (themeValue: number) => {
    const newSettings = { ...userSettings.value, theme: themeValue }
    await updateUserSettings(newSettings)
  }

  /**
   * Update culture setting and sync with i18n
   * @param cultureValue - CULTURE_VALUES.VIETNAMESE for Vietnamese, CULTURE_VALUES.ENGLISH for English
   */
  const updateCulture = async (cultureValue: number) => {
    const newSettings = { ...userSettings.value, culture: cultureValue }
    await updateUserSettings(newSettings)

    // Sync with i18n locale using conversion method
    const i18n = (await import('@/i18n')).default
    const culture = numericToStringCulture(cultureValue)
    i18n.global.locale.value = culture
  }

  /**
   * Get current culture as string ('vi'|'en')
   */
  const getCurrentCulture = (): CultureText => {
    return numericToStringCulture(userSettings.value.culture)
  }

  /**
   * Get current theme as string ('light'|'dark')
   */
  const getCurrentTheme = (): ThemeText => {
    return numericToStringTheme(userSettings.value.theme)
  }

  return {
    // State
    users,
    pagination,
    // User Settings State  
    userSettings,
    // Actions
    setUsers,
    fetchUsers,
    deleteUser,
    toggleUserStatus,
    clearState,
    // User Settings Actions
    setUserSettings,
    fetchUserSettings,
    updateUserSettings,
    updateTheme,
    updateCulture,
    getCurrentCulture,
    getCurrentTheme,
  }
})
