import type {
  GetUsersParams,
  GetUsersResponse,
  UserData,
} from '@/types'
import { apiService } from './api'
import { buildApiUrl } from '@/config'

// User API endpoints
const USER_ENDPOINTS = {
  USERS: '/admins/users', // Based on the curl command provided
} as const

// User service class
class UserService {
  /**
   * Get a paginated list of users
   */
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const url = buildApiUrl(USER_ENDPOINTS.USERS)
    return await apiService.get<GetUsersResponse>(url, { params })
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    const url = buildApiUrl(`${USER_ENDPOINTS.USERS}/${userId}`)
    return await apiService.delete(url)
  }

  /**
   * Activate a user
   */
  async activateUser(userId: string): Promise<UserData> {
    const url = buildApiUrl(`${USER_ENDPOINTS.USERS}/${userId}/activate`)
    return await apiService.post<UserData>(url)
  }

  /**
   * Deactivate a user
   */
  async deactivateUser(userId: string): Promise<UserData> {
    const url = buildApiUrl(`${USER_ENDPOINTS.USERS}/${userId}/deactivate`)
    return await apiService.post<UserData>(url)
  }
}

// Create and export the user service instance
export const userService = new UserService()
