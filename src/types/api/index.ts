/**
 * API Types Index
 * Central export for all API-related types
 */

// Admin types
export type {
    CreateAdminRequest,
    CreateAdminResponse,
    // UpdateAdminRequest,
    // DashboardStats,
    // SystemHealth,
    // SystemLog,
    // Permission,
    // Role,
    // CreateRoleRequest,
    // UpdateRoleRequest,
    // AuditLog,
    // AuditLogParams,
    // SystemSettings,
} from './admin.types'

// Common types
export type {
    ApiResponse,
    PaginatedResponse,
    ApiError,
    ErrorResponse,
    PaginationParams,
    SortParams,
    SearchParams,
    FilterParams,
    FileUploadResponse,
    UploadProgress,
} from './common.types'