// /**
//  * Admin API Types
//  * All interfaces related to admin management API endpoints
//  */
export interface CreateAdminRequest {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    isSystemAdmin: boolean
}

export interface CreateAdminResponse {
    id: string
    fullName: string
    email: string
    isSystemAdmin: boolean
    createdAt: string
    isActive: boolean,
    lastLoginAt?: string,
    avatarUrl?: string
}


// // Admin creation and management

// export interface UpdateAdminRequest {
//     firstName?: string
//     lastName?: string
//     isSystemAdmin?: boolean
//     status?: 'active' | 'inactive' | 'pending'
// }

// // Dashboard and statistics
// export interface DashboardStats {
//     totalUsers: number
//     activeUsers: number
//     totalRevenue: number
//     pendingOrders: number
//     newRegistrations: number
//     supportTickets: number
// }

// export interface SystemHealth {
//     status: 'healthy' | 'warning' | 'critical'
//     uptime: number
//     memoryUsage: number
//     cpuUsage: number
//     diskUsage: number
//     activeConnections: number
// }

// export interface SystemLog {
//     id: string
//     level: 'info' | 'warning' | 'error' | 'debug'
//     message: string
//     timestamp: string
//     source: string
//     metadata?: Record<string, unknown>
// }

// // Permissions and roles
// export interface Permission {
//     id: string
//     name: string
//     description: string
//     resource: string
//     action: string
// }

// export interface Role {
//     id: string
//     name: string
//     description: string
//     permissions: Permission[]
//     isSystem: boolean
// }

// export interface CreateRoleRequest {
//     name: string
//     description: string
//     permissions: string[]
// }

// export interface UpdateRoleRequest {
//     name?: string
//     description?: string
//     permissions?: string[]
// }

// // Audit and system settings
// export interface AuditLog {
//     id: string
//     userId: string
//     action: string
//     resource: string
//     resourceId?: string
//     details: Record<string, unknown>
//     timestamp: string
//     ipAddress: string
//     userAgent: string
// }

// export interface AuditLogParams {
//     startDate?: string
//     endDate?: string
//     userId?: string
//     action?: string
//     resource?: string
//     page?: number
//     limit?: number
// }

// export interface SystemSettings {
//     general: {
//         siteName: string
//         siteUrl: string
//         contactEmail: string
//         timezone: string
//     }
//     security: {
//         passwordMinLength: number
//         passwordRequireSpecialChars: boolean
//         sessionTimeout: number
//         maxLoginAttempts: number
//     }
//     email: {
//         smtpHost: string
//         smtpPort: number
//         smtpUsername: string
//         smtpPassword: string
//         fromEmail: string
//     }
//     features: {
//         registrationEnabled: boolean
//         emailVerificationRequired: boolean
//         twoFactorAuthEnabled: boolean
//     }
// }