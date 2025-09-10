import { apiService } from './api'
import type { User } from '@/types/app-user'

// User API endpoints
const USER_ENDPOINTS = {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_AVATAR: (id: string) => `/users/${id}/avatar`,
    USER_PREFERENCES: (id: string) => `/users/${id}/preferences`
}

// Interface definitions
interface UserListResponse {
    users: User[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

interface UserListParams {
    pageNumber?: number
    pageSize?: number
    searchTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    role?: string
    status?: 'active' | 'inactive' | 'pending'
}

interface CreateUserRequest {
    email: string
    firstName: string
    lastName: string
    role: string
    phoneNumber?: string
    department?: string
}

interface UpdateUserRequest {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    department?: string
    role?: string
    status?: 'active' | 'inactive'
}

interface UserPreferences {
    theme: 'light' | 'dark'
    language: string
    notifications: {
        email: boolean
        push: boolean
        sms: boolean
    }
    timezone: string
}

// User service class
class UserService {
    /**
     * Get paginated list of users
     */
    async getUsers(params?: UserListParams): Promise<UserListResponse> {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = queryParams.toString()
            ? `${USER_ENDPOINTS.USERS}?${queryParams.toString()}`
            : USER_ENDPOINTS.USERS

        return await apiService.get<UserListResponse>(url)
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        return await apiService.get<User>(USER_ENDPOINTS.USER_BY_ID(id))
    }

    /**
     * Create new user
     */
    async createUser(userData: CreateUserRequest): Promise<User> {
        return await apiService.post<User>(USER_ENDPOINTS.USERS, userData)
    }

    /**
     * Update user
     */
    async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
        return await apiService.put<User>(USER_ENDPOINTS.USER_BY_ID(id), userData)
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        return await apiService.delete<void>(USER_ENDPOINTS.USER_BY_ID(id))
    }

    /**
     * Activate user account
     */
    async activateUser(id: string): Promise<User> {
        return await apiService.patch<User>(USER_ENDPOINTS.USER_BY_ID(id), { status: 'active' })
    }

    /**
     * Deactivate user account
     */
    async deactivateUser(id: string): Promise<User> {
        return await apiService.patch<User>(USER_ENDPOINTS.USER_BY_ID(id), { status: 'inactive' })
    }

    /**
     * Upload user avatar
     */
    async uploadAvatar(id: string, file: File, onUploadProgress?: (progressEvent: any) => void): Promise<{ avatarUrl: string }> {
        return await apiService.uploadFile<{ avatarUrl: string }>(
            USER_ENDPOINTS.USER_AVATAR(id),
            file,
            onUploadProgress
        )
    }

    /**
     * Get user preferences
     */
    async getUserPreferences(id: string): Promise<UserPreferences> {
        return await apiService.get<UserPreferences>(USER_ENDPOINTS.USER_PREFERENCES(id))
    }

    /**
     * Update user preferences
     */
    async updateUserPreferences(id: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
        return await apiService.put<UserPreferences>(USER_ENDPOINTS.USER_PREFERENCES(id), preferences)
    }

    /**
     * Search users by term
     */
    async searchUsers(searchTerm: string, limit = 10): Promise<User[]> {
        const params = new URLSearchParams({
            searchTerm,
            pageSize: limit.toString()
        })

        const response = await apiService.get<UserListResponse>(`${USER_ENDPOINTS.USERS}?${params.toString()}`)
        return response.users
    }

    /**
     * Get users by role
     */
    async getUsersByRole(role: string): Promise<User[]> {
        const params = new URLSearchParams({ role })
        const response = await apiService.get<UserListResponse>(`${USER_ENDPOINTS.USERS}?${params.toString()}`)
        return response.users
    }

    /**
     * Bulk update users
     */
    async bulkUpdateUsers(userIds: string[], updateData: UpdateUserRequest): Promise<void> {
        return await apiService.patch<void>(`${USER_ENDPOINTS.USERS}/bulk`, {
            userIds,
            updateData
        })
    }

    /**
     * Export users to CSV
     */
    async exportUsers(params?: UserListParams): Promise<void> {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = `${USER_ENDPOINTS.USERS}/export?${queryParams.toString()}`
        return await apiService.downloadFile(url, 'users.csv')
    }
}

// Create and export the user service instance
export const userService = new UserService()

// Export types
export type {
    UserListResponse,
    UserListParams,
    CreateUserRequest,
    UpdateUserRequest,
    UserPreferences
}
