/**
 * API Types Index
 * Central export for all API-related types
 */

// Admin types
export type {
    CreateAdminRequest,
    CreateAdminResponse,
    UpdateAdminRequest,
    DashboardStats,
    SystemHealth,
    SystemLog,
    Permission,
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
    AuditLog,
    AuditLogParams,
    SystemSettings,
} from './admin.types'

// User types
export type {
    UserData,
    UserListResponse,
    UserListParams,
    CreateUserRequest,
    UpdateUserRequest,
    UserPreferences,
} from './user.types'

// Auth types
export type {
    LoginCredentials,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
} from './auth.types'

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