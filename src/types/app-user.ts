import type { User } from 'oidc-client-ts'

export interface AppUser extends User {
  isSystemAdmin: () => boolean
  isAdmin: () => boolean
  isSeller: () => boolean
}

export function toAppUser(user: User | null): AppUser | null {
  if (!user) return null
  const u = user as AppUser

  // Helper function to check if role matches
  const hasRole = (role: unknown, targetRole: string): boolean => {
    if (!role) return false
    if (typeof role === 'string') return role === targetRole
    if (Array.isArray(role)) return role.flat().includes(targetRole)
    return false
  }

  if (!u.isSystemAdmin) {
    u.isSystemAdmin = () => {
      return hasRole(u.profile?.role, 'SystemAdmin')
    }
  }

  if (!u.isAdmin) {
    u.isAdmin = () => {
      return hasRole(u.profile?.role, 'Admin')
    }
  }

  if (!u.isSeller) {
    u.isSeller = () => {
      return hasRole(u.profile?.role, 'Seller')
    }
  }

  return u
}