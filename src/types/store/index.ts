/**
 * Store Types
 * Types for Pinia stores and state management
 */

import type { AppUser } from '../app-user'
import type { UserData, UserListParams } from '../api/user.types'

// App store types (notifications, theme, loading)
export interface NotificationOptions {
    id?: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
}

export interface Notification extends Required<NotificationOptions> {
    id: string
}

export interface AppState {
    isLoading: boolean
    theme: 'light' | 'dark'
    notifications: Notification[]
    sidebarCollapsed: boolean
    user: AppUser | null
}

// User store types
export interface UserStoreState {
    users: UserData[]
    currentUser: UserData | null
    isLoading: boolean
    error: string | null
    pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
    }
    filters: UserListParams
}

// Auth store types
export interface AuthState {
    isAuthenticated: boolean
    user: AppUser | null
    accessToken: string | null
    refreshToken: string | null
    permissions: string[]
    roles: string[]
    isLoading: boolean
    error: string | null
}

// General store action types
export interface StoreAction<T = unknown, R = void> {
    (payload: T): Promise<R> | R
}

export interface StoreGetters<T> {
    [key: string]: (state: T) => unknown
}

// Store error handling
export interface StoreError {
    message: string
    code?: string | number
    details?: Record<string, unknown>
    timestamp: Date
}