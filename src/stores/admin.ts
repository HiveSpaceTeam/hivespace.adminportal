import type { CreateAdminRequest, CreateAdminResponse } from '@/services/admin.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminService } from '@/services/admin.service'

export const useAdminStore = defineStore('admin', () => {
    // State
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const createdAdmin = ref<CreateAdminResponse | null>(null)

    // Actions
    function setLoading(loading: boolean) {
        isLoading.value = loading
    }

    function setError(errorMessage: string | null) {
        error.value = errorMessage
    }

    function setCreatedAdmin(admin: CreateAdminResponse | null) {
        createdAdmin.value = admin
    }

    async function createAdmin(adminData: CreateAdminRequest) {
        setError(null)
        setCreatedAdmin(null)
        await adminService.createAdmin(adminData)
    }

    function clearState() {
        setError(null)
        setCreatedAdmin(null)
    }

    return {
        // State
        isLoading,
        error,
        createdAdmin,
        // Actions
        setLoading,
        setError,
        setCreatedAdmin,
        createAdmin,
        clearState
    }
})