import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, CreateUserRequest, UpdateUserRequest, GetUsersParams, UserListResponse } from '@/types/app-user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function setUsers(userList: User[]) {
    users.value = userList
  }

  function addUser(user: User) {
    users.value.push(user)
  }

  function updateUser(userId: string, updatedUser: Partial<User>) {
    const index = users.value.findIndex(user => user.id === userId)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser }
    }
  }

  function removeUser(userId: string) {
    const index = users.value.findIndex(user => user.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  async function fetchUsers(params?: any) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const response = await userService.getUsers(params)
      setUsers(response.users)
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function createUser(userData: any) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const newUser = await userService.createUser(userData)
      addUser(newUser)
      return newUser
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function updateUserById(userId: string, userData: Partial<User>) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const updatedUser = await userService.updateUser(userId, userData)
      updateUser(userId, updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(userId: string) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      await userService.deleteUser(userId)
      removeUser(userId)
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    users,
    isLoading,
    error,
    // Actions
    setLoading,
    setError,
    setUsers,
    addUser,
    updateUser,
    removeUser,
    fetchUsers,
    createUser,
    updateUserById,
    deleteUser
  }
})
