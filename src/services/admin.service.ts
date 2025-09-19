import type { CreateAdminRequest, CreateAdminResponse } from '@/types'
import { apiService } from './api'
import { buildApiUrl } from '@/config'

// Admin API endpoints (without version prefix since buildApiUrl handles versioning)
const ADMIN_ENDPOINTS = {
  ADMINS: '/admins',
} as const

// Admin service class
class AdminService {
  /**
   * Create a new admin user
   */
  async createAdmin(adminData: CreateAdminRequest): Promise<CreateAdminResponse> {
    const url = buildApiUrl(ADMIN_ENDPOINTS.ADMINS)
    return await apiService.post<CreateAdminResponse>(url, adminData)
  }
}

// Create and export the admin service instance
export const adminService = new AdminService()
