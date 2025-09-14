import { apiService } from './api'

// User API endpoints (with API versioning)
const USER_ENDPOINTS = {
    USERS: '/v1/users',
    USER_BY_ID: (id: string) => `/v1/users/${id}`,
    USER_AVATAR: (id: string) => `/v1/users/${id}/avatar`,
    USER_PREFERENCES: (id: string) => `/v1/users/${id}/preferences`
}

// Interface definitions
interface UserData {
    id: string
    username: string
    fullName: string
    email: string
    status: 'Active' | 'Inactive'
    hasSeller: boolean
    createdDate: string
    lastLoginDate: string
    avatar?: string
}

interface UserListResponse {
    users: UserData[]
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
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        return await apiService.delete<void>(USER_ENDPOINTS.USER_BY_ID(id))
    }

    /**
     * Activate user account
     */
    async activateUser(id: string): Promise<UserData> {
        return await apiService.patch<UserData>(USER_ENDPOINTS.USER_BY_ID(id), { status: 'active' })
    }

    /**
     * Deactivate user account
     */
    async deactivateUser(id: string): Promise<UserData> {
        return await apiService.patch<UserData>(USER_ENDPOINTS.USER_BY_ID(id), { status: 'inactive' })
    }

    /**
     * Upload user avatar
     */
    async uploadAvatar(id: string, file: File, onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<{ avatarUrl: string }> {
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
    async searchUsers(searchTerm: string, limit = 10): Promise<UserData[]> {
        const params = new URLSearchParams({
            searchTerm,
            pageSize: limit.toString()
        })

        const response = await apiService.get<UserListResponse>(`${USER_ENDPOINTS.USERS}?${params.toString()}`)
        return response.users
    }
}

// Create and export the user service instance
export const userService = new UserService()

// Export types
export type {
    UserData,
    UserListResponse,
    UserListParams,
    CreateUserRequest,
    UpdateUserRequest,
    UserPreferences
}
