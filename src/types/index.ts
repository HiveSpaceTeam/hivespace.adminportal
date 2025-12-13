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
export * from '@hivespace/shared'

// API common types (kept under api for backend contracts)
export * from '@hivespace/shared'

// Utility types - Helper and common types
export * from '@hivespace/shared'

// App-specific types
export type { AppUser } from '@hivespace/shared'
