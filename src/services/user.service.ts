import {
  UserType,
  type GetUsersParams,
  type GetUsersResponse,
  type User,
  type GetUserSettingResponse,
  type SetUserSettingRequest,
} from '@/types'
import { apiService } from './api'
import { buildApiUrl } from '@/config'

// User API endpoints
const USER_ENDPOINTS = {
  USERS: '/admins/users', // Based on the curl command provided
  USER_SETTINGS: '/users/settings', // User settings endpoint
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
   * Delete a user (soft delete)
   */
  async deleteUser(userId: string): Promise<void> {
    const url = buildApiUrl(`${USER_ENDPOINTS.USERS}/${userId}`)
    await apiService.delete(url)
  }

  /**
   * Activate/Deactivate an user
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const url = buildApiUrl(`${USER_ENDPOINTS.USERS}/status`)
    return await apiService.put<User>(url, { userId, isActive, responseType: UserType.User })
  }

  /**
   * Get user settings
   */
  async getUserSetting(): Promise<GetUserSettingResponse> {
    const url = buildApiUrl(USER_ENDPOINTS.USER_SETTINGS)
    return await apiService.get<GetUserSettingResponse>(url)
  }

  /**
   * Set user settings (returns 204 on success)
   */
  async setUserSetting(settingsData: SetUserSettingRequest): Promise<void> {
    const url = buildApiUrl(USER_ENDPOINTS.USER_SETTINGS)
    await apiService.put<void>(url, settingsData)
  }
}

// Create and export the user service instance
export const userService = new UserService()
