import type { Admin, CreateAdminRequest } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAppStore } from './app'

export const useAdminStore = defineStore('admin', () => {
  // State
  const createdAdmin = ref<Admin | null>(null)

  const setCreatedAdmin = (admin: Admin | null) => {
    createdAdmin.value = admin
  }

  const createAdmin = async (adminData: CreateAdminRequest) => {
    const appStore = useAppStore()

    try {
      // Show loading state
      appStore.setLoading(true)
      setCreatedAdmin(null)

      const response = await adminService.createAdmin(adminData)

      // Map CreateAdminResponse to Admin interface
      const admin: Admin = {
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        isSystemAdmin: response.isSystemAdmin,
        createdDate: response.createdAt,
        lastLoginDate: response.lastLoginAt,
        avatar: response.avatarUrl,
        status: response.isActive ? 'active' : 'inactive',
      }

      setCreatedAdmin(admin)
      return admin
    } finally {
      // Hide loading state
      appStore.setLoading(false)
    }
  }

  const clearState = () => {
    setCreatedAdmin(null)
  }

  return {
    // State
    createdAdmin,
    // Actions
    setCreatedAdmin,
    createAdmin,
    clearState,
  }
})
