/**
 * User API Types
 * All interfaces related to user management API endpoints
 */

// User data structures
export interface UserData {
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

export interface UserListResponse {
    users: UserData[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

export interface UserListParams {
    pageNumber?: number
    pageSize?: number
    searchTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    role?: string
    status?: 'active' | 'inactive' | 'pending'
}

// User creation and updates
export interface CreateUserRequest {
    email: string
    firstName: string
    lastName: string
    role: string
    phoneNumber?: string
    department?: string
}

export interface UpdateUserRequest {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    department?: string
    role?: string
    status?: 'active' | 'inactive'
}

// User preferences
export interface UserPreferences {
    theme: 'light' | 'dark'
    language: string
    notifications: {
        email: boolean
        push: boolean
        sms: boolean
    }
    timezone: string
}