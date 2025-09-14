import type { CreateAdminRequest, CreateAdminResponse } from '@/types'
import { apiService } from './api'

// Admin API endpoints (with API versioning)
const ADMIN_ENDPOINTS = {
    ADMINS: '/v1/admins',
    DASHBOARD: '/v1/admin/dashboard',
    SYSTEM_STATS: '/v1/admin/system/stats',
    SYSTEM_HEALTH: '/v1/admin/system/health',
    SYSTEM_LOGS: '/v1/admin/system/logs',
    PERMISSIONS: '/v1/admin/permissions',
    ROLES: '/v1/admin/roles',
    ROLE_BY_ID: (id: string) => `/v1/admin/roles/${id}`,
    AUDIT_LOGS: '/v1/admin/audit-logs',
    SETTINGS: '/v1/admin/settings',
    CACHE: '/v1/admin/cache',
    BACKUP: '/v1/admin/backup'
}
interface DashboardStats {
    totalUsers: number
    activeUsers: number
    totalTransactions: number
    systemUptime: string
    memoryUsage: number
    cpuUsage: number
    diskUsage: number
}

interface SystemHealth {
    status: 'healthy' | 'warning' | 'critical'
    services: Array<{
        name: string
        status: 'up' | 'down' | 'degraded'
        responseTime: number
        lastChecked: string
    }>
    database: {
        status: 'connected' | 'disconnected'
        responseTime: number
    }
    redis: {
        status: 'connected' | 'disconnected'
        responseTime: number
    }
}

interface SystemLog {
    id: string
    timestamp: string
    level: 'info' | 'warning' | 'error' | 'debug'
    message: string
    source: string
    userId?: string
    correlationId?: string
}

interface Permission {
    id: string
    name: string
    description: string
    resource: string
    action: string
}

interface Role {
    id: string
    name: string
    description: string
    permissions: Permission[]
    isSystemRole: boolean
    createdAt: string
    updatedAt: string
}

interface CreateRoleRequest {
    name: string
    description: string
    permissionIds: string[]
}

interface UpdateRoleRequest {
    name?: string
    description?: string
    permissionIds?: string[]
}

interface AuditLog {
    id: string
    userId: string
    userName: string
    action: string
    resource: string
    resourceId: string
    timestamp: string
    ipAddress: string
    userAgent: string
    details: Record<string, unknown>
}

interface AuditLogParams {
    pageNumber?: number
    pageSize?: number
    userId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
}

interface SystemSettings {
    general: {
        siteName: string
        siteUrl: string
        contactEmail: string
        timezone: string
    }
    security: {
        passwordMinLength: number
        passwordRequireSpecialChars: boolean
        sessionTimeout: number
        maxLoginAttempts: number
    }
    email: {
        smtpHost: string
        smtpPort: number
        smtpUsername: string
        smtpPassword: string
        fromEmail: string
    }
    features: {
        registrationEnabled: boolean
        emailVerificationRequired: boolean
        twoFactorAuthEnabled: boolean
    }
}

// Admin service class
class AdminService {
    /**
     * Create a new admin user
     */
    async createAdmin(adminData: CreateAdminRequest): Promise<CreateAdminResponse> {
        return await apiService.post<CreateAdminResponse>(ADMIN_ENDPOINTS.ADMINS, adminData)
    }

    /**
     * Get list of admin users
     */
    async getAdmins(params?: {
        pageNumber?: number
        pageSize?: number
        search?: string
        isSystemAdmin?: boolean
        isActive?: boolean
    }): Promise<{ admins: CreateAdminResponse[]; totalCount: number }> {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = queryParams.toString()
            ? `${ADMIN_ENDPOINTS.ADMINS}?${queryParams.toString()}`
            : ADMIN_ENDPOINTS.ADMINS

        return await apiService.get<{ admins: CreateAdminResponse[]; totalCount: number }>(url)
    }

    /**
     * Update admin user
     */
    async updateAdmin(adminId: string, adminData: Partial<Omit<CreateAdminRequest, 'password'>>): Promise<CreateAdminResponse> {
        return await apiService.put<CreateAdminResponse>(`${ADMIN_ENDPOINTS.ADMINS}/${adminId}`, adminData)
    }

    /**
     * Delete admin user
     */
    async deleteAdmin(adminId: string): Promise<void> {
        return await apiService.delete<void>(`${ADMIN_ENDPOINTS.ADMINS}/${adminId}`)
    }

    /**
     * Toggle admin active status
     */
    async toggleAdminStatus(adminId: string, isActive: boolean): Promise<CreateAdminResponse> {
        return await apiService.patch<CreateAdminResponse>(`${ADMIN_ENDPOINTS.ADMINS}/${adminId}/status`, { isActive })
    }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        return await apiService.get<DashboardStats>(ADMIN_ENDPOINTS.DASHBOARD)
    }

    /**
     * Get system health status
     */
    async getSystemHealth(): Promise<SystemHealth> {
        return await apiService.get<SystemHealth>(ADMIN_ENDPOINTS.SYSTEM_HEALTH)
    }

    /**
     * Get system logs
     */
    async getSystemLogs(params?: {
        pageNumber?: number
        pageSize?: number
        level?: string
        source?: string
        startDate?: string
        endDate?: string
    }): Promise<{ logs: SystemLog[]; totalCount: number }> {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = queryParams.toString()
            ? `${ADMIN_ENDPOINTS.SYSTEM_LOGS}?${queryParams.toString()}`
            : ADMIN_ENDPOINTS.SYSTEM_LOGS

        return await apiService.get<{ logs: SystemLog[]; totalCount: number }>(url)
    }

    /**
     * Get all permissions
     */
    async getPermissions(): Promise<Permission[]> {
        return await apiService.get<Permission[]>(ADMIN_ENDPOINTS.PERMISSIONS)
    }

    /**
     * Get all roles
     */
    async getRoles(): Promise<Role[]> {
        return await apiService.get<Role[]>(ADMIN_ENDPOINTS.ROLES)
    }

    /**
     * Get role by ID
     */
    async getRoleById(id: string): Promise<Role> {
        return await apiService.get<Role>(ADMIN_ENDPOINTS.ROLE_BY_ID(id))
    }

    /**
     * Create new role
     */
    async createRole(roleData: CreateRoleRequest): Promise<Role> {
        return await apiService.post<Role>(ADMIN_ENDPOINTS.ROLES, roleData)
    }

    /**
     * Update role
     */
    async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
        return await apiService.put<Role>(ADMIN_ENDPOINTS.ROLE_BY_ID(id), roleData)
    }

    /**
     * Delete role
     */
    async deleteRole(id: string): Promise<void> {
        return await apiService.delete<void>(ADMIN_ENDPOINTS.ROLE_BY_ID(id))
    }

    /**
     * Get audit logs
     */
    async getAuditLogs(params?: AuditLogParams): Promise<{ logs: AuditLog[]; totalCount: number }> {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = queryParams.toString()
            ? `${ADMIN_ENDPOINTS.AUDIT_LOGS}?${queryParams.toString()}`
            : ADMIN_ENDPOINTS.AUDIT_LOGS

        return await apiService.get<{ logs: AuditLog[]; totalCount: number }>(url)
    }

    /**
     * Get system settings
     */
    async getSystemSettings(): Promise<SystemSettings> {
        return await apiService.get<SystemSettings>(ADMIN_ENDPOINTS.SETTINGS)
    }

    /**
     * Update system settings
     */
    async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
        return await apiService.put<SystemSettings>(ADMIN_ENDPOINTS.SETTINGS, settings)
    }

    /**
     * Clear cache
     */
    async clearCache(cacheKey?: string): Promise<void> {
        const data = cacheKey ? { key: cacheKey } : {}
        return await apiService.post<void>(`${ADMIN_ENDPOINTS.CACHE}/clear`, data)
    }

    /**
     * Create system backup
     */
    async createBackup(): Promise<{ backupId: string; downloadUrl: string }> {
        return await apiService.post<{ backupId: string; downloadUrl: string }>(ADMIN_ENDPOINTS.BACKUP)
    }

    /**
     * Get backup list
     */
    async getBackups(): Promise<Array<{
        id: string
        filename: string
        size: number
        createdAt: string
        downloadUrl: string
    }>> {
        return await apiService.get<Array<{
            id: string
            filename: string
            size: number
            createdAt: string
            downloadUrl: string
        }>>(ADMIN_ENDPOINTS.BACKUP)
    }

    /**
     * Download backup
     */
    async downloadBackup(backupId: string): Promise<void> {
        return await apiService.downloadFile(`${ADMIN_ENDPOINTS.BACKUP}/${backupId}/download`)
    }

    /**
     * Delete backup
     */
    async deleteBackup(backupId: string): Promise<void> {
        return await apiService.delete<void>(`${ADMIN_ENDPOINTS.BACKUP}/${backupId}`)
    }
}

// Create and export the admin service instance
export const adminService = new AdminService()

// Export types
export type {
    CreateAdminRequest,
    CreateAdminResponse,
    DashboardStats,
    SystemHealth,
    SystemLog,
    Permission,
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
    AuditLog,
    AuditLogParams,
    SystemSettings
}
