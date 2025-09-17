/**
 * Admin-related type definitions
 * Contains interfaces and types used throughout the admin management system
 */

// Admin data structure for UI components
export interface Admin {
  id: string
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