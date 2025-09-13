import { apiService } from './api'

// Auth API endpoints
const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    PROFILE: '/auth/profile'
}

// Interface definitions
interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

interface LoginResponse {
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

interface RefreshTokenRequest {
    refreshToken: string
}

interface RefreshTokenResponse {
    accessToken: string
    expiresIn: number
}

interface RegisterRequest {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
}

interface ForgotPasswordRequest {
    email: string
}

interface ResetPasswordRequest {
    token: string
    password: string
    confirmPassword: string
}

interface VerifyEmailRequest {
    token: string
}

// Auth service class
class AuthService {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        return await apiService.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const request: RefreshTokenRequest = { refreshToken }
        return await apiService.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, request)
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        return await apiService.post<void>(AUTH_ENDPOINTS.LOGOUT)
    }

    /**
     * Register new user
     */
    async register(userData: RegisterRequest): Promise<void> {
        return await apiService.post<void>(AUTH_ENDPOINTS.REGISTER, userData)
    }

    /**
     * Send forgot password email
     */
    async forgotPassword(email: string): Promise<void> {
        const request: ForgotPasswordRequest = { email }
        return await apiService.post<void>(AUTH_ENDPOINTS.FORGOT_PASSWORD, request)
    }

    /**
     * Reset password with token
     */
    async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
        return await apiService.post<void>(AUTH_ENDPOINTS.RESET_PASSWORD, resetData)
    }

    /**
     * Verify email address
     */
    async verifyEmail(token: string): Promise<void> {
        const request: VerifyEmailRequest = { token }
        return await apiService.post<void>(AUTH_ENDPOINTS.VERIFY_EMAIL, request)
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<LoginResponse['user']> {
        return await apiService.get<LoginResponse['user']>(AUTH_ENDPOINTS.PROFILE)
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData: Partial<LoginResponse['user']>): Promise<LoginResponse['user']> {
        return await apiService.put<LoginResponse['user']>(AUTH_ENDPOINTS.PROFILE, profileData)
    }
}

// Create and export the auth service instance
export const authService = new AuthService()

// Export types
export type {
    LoginCredentials,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest
}
