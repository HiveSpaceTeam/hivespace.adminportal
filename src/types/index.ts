/**
 * Types Index
 * Central export point for all application types
 *
 * Usage examples:
 * import type { CreateAdminRequest, AdminModalResult } from '@/types'
 * import type { UserData, TableColumn } from '@/types'
 */

// Unified Admin (store-facing) types
export * from './admin.types'

// User types
export * from './user.types'

// User settings types
export * from './user-settings.types'

export type { ErrorResponse } from '@hivespace/shared'
