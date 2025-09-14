import { BaseApiService } from './api.service'

// Types based on API design
export interface UserData {
  id: string
  username: string
  fullName: string
  email: string
  status: number // 1=Active, 2=Inactive, 3=Suspended, 4=Deleted
  isSeller: boolean
  createdDate: string
  lastLoginDate: string | null
  avatar: string | null
}

export interface PaginationData {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserListResponse {
  users: UserData[]
  pagination: PaginationData
}

export interface UserListParams {
  page?: number
  pageSize?: number
  role?: number // 0=All, 1=Customer, 2=Seller
  status?: number // 0=All, 1=Active, 2=Inactive
  searchTerm?: string
  sort?: string // Format: "field.direction"
}

// User Status enum for frontend use
export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Deleted = 4
}

// Role Filter enum
export enum UserRoleFilter {
  All = 0,
  Customer = 1,
  Seller = 2
}

// Status Filter enum
export enum UserStatusFilter {
  All = 0,
  Active = 1,
  Inactive = 2
}

// User Service class extending BaseApiService
class UserService extends BaseApiService {
  constructor() {
    super('/api/v1/admin/users')
  }

  // Get users list with parameters
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    // Default params
    const defaultParams: UserListParams = {
      page: 1,
      pageSize: 10,
      role: 0,
      status: 0,
      searchTerm: '',
      sort: 'createdDate.desc'
    }

    const finalParams = { ...defaultParams, ...params }

    // Convert params to query string
    const queryParams = new URLSearchParams()
    Object.entries(finalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    console.log('API Call:', `${this.baseEndpoint}?${queryParams.toString()}`)

    const response = await this.get<UserListResponse>(`?${queryParams.toString()}`)

    // Ensure pagination data is properly formatted
    if (response && response.pagination) {
      response.pagination = {
        ...response.pagination,
        hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
        hasPreviousPage: response.pagination.currentPage > 1
      }
    }

    return response
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    await this.delete(`/${userId}`)
  }

  // Activate user
  async activateUser(userId: string): Promise<UserData> {
    return await this.patch<UserData>(`/${userId}/activate`)
  }

  // Deactivate user
  async deactivateUser(userId: string): Promise<UserData> {
    return await this.patch<UserData>(`/${userId}/deactivate`)
  }

  // Update user status
  async updateUserStatus(userId: string, status: UserStatus): Promise<UserData> {
    return await this.patch<UserData>(`/${userId}/status`, { status })
  }
}

// Export singleton instance
export const userService = new UserService()

// Helper functions for frontend
export const getUserStatusText = (status: number): string => {
  switch (status) {
    case UserStatus.Active:
      return 'Active'
    case UserStatus.Inactive:
      return 'Inactive'
    case UserStatus.Suspended:
      return 'Suspended'
    case UserStatus.Deleted:
      return 'Deleted'
    default:
      return 'Unknown'
  }
}

export const getUserStatusColor = (status: number): 'success' | 'error' | 'warning' => {
  switch (status) {
    case UserStatus.Active:
      return 'success'
    case UserStatus.Inactive:
      return 'warning'
    case UserStatus.Suspended:
    case UserStatus.Deleted:
      return 'error'
    default:
      return 'error'
  }
}
