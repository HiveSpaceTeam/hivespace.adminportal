import type { Pagination } from '@/types'

export interface User {
  id: string
  username: string
  fullName: string
  email: string
  status: number
  isSeller: boolean
  createdAt: string
  updatedAt: string | null
  lastLoginAt: string | null
  avatarUrl: string
}

// Query params for GET /admins/users
export interface GetUsersParams {
  page?: number
  pageSize?: number
  role?: number
  status?: number
  searchTerm?: string
  sort?: string
}

// Response shape for GET /admins/users
export interface GetUsersResponse {
  users: User[]
  pagination: Pagination
}

// Legacy interface for backward compatibility
export interface UserData extends User { }
