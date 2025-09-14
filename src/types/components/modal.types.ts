/**
 * Modal Component Types
 * Types for modal components and their interactions
 */

// Modal variants and sizes (based on your useConfirmModal)
export type ModalVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline-primary' | 'outline-secondary'

// Base modal interfaces
export interface BaseModalProps {
    variant?: ModalVariant
    size?: ModalSize
    title?: string
    showIcon?: boolean
    closeOnBackdrop?: boolean
    autoSize?: boolean
}

export interface ConfirmModalOptions extends BaseModalProps {
    message?: string
    confirmText?: string
    cancelText?: string
    thirdText?: string
    confirmVariant?: ButtonVariant
    thirdVariant?: ButtonVariant
    loading?: boolean
}

// Modal result types
export interface ModalResult<T = unknown> {
    action: 'confirm' | 'cancel' | 'third' | 'close'
    data?: T
}

// Admin modal specific types  
export interface AdminModalProps extends BaseModalProps {
    mode: 'create' | 'edit' | 'view'
    adminData?: {
        id?: string
        email?: string
        firstName?: string
        lastName?: string
        isSystemAdmin?: boolean
    }
}

// User modal types
export interface UserModalProps extends BaseModalProps {
    mode: 'create' | 'edit' | 'view'
    userData?: {
        id?: string
        email?: string
        firstName?: string
        lastName?: string
        role?: string
        status?: 'active' | 'inactive'
    }
}

export interface UserModalResult {
    action: 'create' | 'update' | 'cancel' | 'delete'
    data?: {
        id?: string
        email: string
        firstName: string
        lastName: string
        role: string
        status?: 'active' | 'inactive'
    }
}