
import type { Pagination, Status } from '@/types'
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
  isActive: boolean
  lastLoginAt?: string
  updatedAt?: string
  avatarUrl?: string
}

export interface Admin {
  id: string
  username: string
  fullName: string
  email: string
  status: Status
  isSystemAdmin: boolean
  createdAt: string
  updatedAt?: string | null
  lastLoginAt?: string | null
  avatarUrl?: string | null
}

// Query params for GET /admins
export interface GetAdminsParams {
  page?: number
  pageSize?: number
  role?: number
  status?: number
  searchTerm?: string
  sort?: string
}

// Response shape for GET /admins
export interface GetAdminsResponse {
  admins: Admin[]
  pagination: Pagination
}
