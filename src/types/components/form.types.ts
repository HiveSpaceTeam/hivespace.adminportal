/**
 * Form Component Types
 * Types for form components, validation, and form states
 */

// Form field types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'success' | 'error' | 'warning'

// Form validation
export interface ValidationRule {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    email?: boolean
    custom?: (value: string) => boolean | string
}

export interface FormField {
    name: string
    label: string
    type: InputType
    value: string | number
    placeholder?: string
    size?: InputSize
    variant?: InputVariant
    validation?: ValidationRule
    error?: string
    disabled?: boolean
    readonly?: boolean
}

export interface FormState {
    fields: Record<string, FormField>
    isValid: boolean
    isDirty: boolean
    isSubmitting: boolean
    errors: Record<string, string>
}

// Select/dropdown types
export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
    group?: string
}

export interface SelectField extends Omit<FormField, 'type'> {
    type: 'select'
    options: SelectOption[]
    multiple?: boolean
    searchable?: boolean
}

// File upload types
export interface FileUploadField extends Omit<FormField, 'type' | 'value'> {
    type: 'file'
    accept?: string
    multiple?: boolean
    maxSize?: number
    maxFiles?: number
    value: File[]
}

// Form submission
export interface FormSubmissionResult<T = unknown> {
    success: boolean
    data?: T
    errors?: Record<string, string>
    message?: string
}