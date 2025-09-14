/**
 * Authentication API Types
 * All interfaces related to authentication API endpoints
 */

// Login and authentication
export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: {
        id: string
        email: string
        name: string
        role: string
        permissions: string[]
    }
}

export interface RefreshTokenRequest {
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
    expiresIn: number
}

// Registration
export interface RegisterRequest {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
}

// Password management
export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
    confirmPassword: string
}

// Email verification
export interface VerifyEmailRequest {
    token: string
}