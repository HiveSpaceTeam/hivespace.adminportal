/**
 * Admin Component Types
 * Types specific to admin management components
 */

import type { CreateAdminResponse } from '../api/admin.types'

// Admin data structure for UI components
export interface Admin {
    id: number
    email: string
    fullName?: string
    adminType?: string
    status?: string
    isSystemAdmin?: boolean
    createdDate?: string
    lastLoginDate?: string
    lastUpdatedDate?: string
    avatar?: string
}

// Admin modal close/result payload
export interface AdminModalClosePayload {
    action?: 'create' | 'cancel'
    data?: CreateAdminResponse
}

// Type alias for modal result
export type AdminModalResult = AdminModalClosePayload | undefined