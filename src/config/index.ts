/**
 * Main configuration file for HiveSpace Admin Portal
 * Uses API Gateway pattern - frontend only communicates with gateway,
 * not directly with individual microservices
 */

// Type definitions for better TypeScript support
export interface AppConfig {
    app: {
        name: string
        version: string
        environment: 'development' | 'staging' | 'production'
    }
    api: {
        baseUrl: string
        timeout: number
    }
    auth: {
        oidc: {
            clientId: string
            redirectUri: string
            postLogoutRedirectUri: string
            responseType: string
            responseMode: string
            scope: string
            automaticSilentRenew: boolean
            silentRedirectUri: string
        }
        callbackUrl: string
    }
    features: {
        enableLogging: boolean
        enableAnalytics: boolean
        enableDebug: boolean
    }
    services: {
        storageBaseUrl: string
        cdnBaseUrl: string
    }
    gateway: {
        baseUrl: string
        version: string
    }
}

// Main configuration object
export const config: AppConfig = {
    // Application settings
    app: {
        name: import.meta.env.VITE_APP_NAME || 'HiveSpace Admin Portal',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: (import.meta.env.VITE_APP_ENVIRONMENT || import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'staging' | 'production',
    },

    // API Configuration (Legacy - use gateway instead)
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    },

    // Authentication Configuration
    auth: {
        oidc: {
            clientId: import.meta.env.VITE_APP_CLIENT_ID || '',
            redirectUri: import.meta.env.VITE_APP_REDIRECT_URI || 'http://localhost:5173/auth/callback',
            postLogoutRedirectUri: import.meta.env.VITE_APP_POST_LOGOUT_REDIRECT_URI || 'http://localhost:5173',
            responseType: import.meta.env.VITE_APP_RESPONSE_TYPE || 'code',
            responseMode: import.meta.env.VITE_APP_RESPONSE_MODE || 'query',
            scope: import.meta.env.VITE_APP_SCOPE || 'openid profile email',
            automaticSilentRenew: import.meta.env.VITE_APP_AUTOMATIC_SILENT_RENEW === 'true',
            silentRedirectUri: import.meta.env.VITE_APP_SILENT_REDIRECT_URI || 'http://localhost:5173/auth/silent-callback',
        },
        callbackUrl: import.meta.env.VITE_AUTH_CALLBACK_URL || 'http://localhost:5173/auth/callback',
    },

    // Feature Flags
    features: {
        enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
        enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.NODE_ENV === 'development',
    },

    // External Services
    services: {
        storageBaseUrl: import.meta.env.VITE_STORAGE_BASE_URL || 'https://storage.hivespace.com',
        cdnBaseUrl: import.meta.env.VITE_CDN_BASE_URL || 'https://cdn.hivespace.com',
    },

    // API Gateway Configuration (replaces direct microservice endpoints)
    gateway: {
        baseUrl: import.meta.env.VITE_GATEWAY_BASE_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
        version: import.meta.env.VITE_API_VERSION || 'v1',
    },
}

// Environment helper functions
export const isDevelopment = (): boolean => config.app.environment === 'development'
export const isProduction = (): boolean => config.app.environment === 'production'
export const isStaging = (): boolean => config.app.environment === 'staging'

// URL utility functions
const joinUrl = (base: string, path: string): string => {
    const prefix = base.endsWith('/') ? base.slice(0, -1) : base
    const suffix = path.startsWith('/') ? path.slice(1) : path
    return `${prefix}/${suffix}`
}

/**
 * Build API URL through the API gateway
 * @param path - API endpoint path
 * @param version - Optional API version override
 * @returns Complete API URL through gateway
 */
export const buildApiUrl = (path: string, version?: string): string => {
    const apiVersion = version || config.gateway.version
    const versionedPath = path.startsWith('/') ? `/${apiVersion}${path}` : `/${apiVersion}/${path}`
    return joinUrl(config.gateway.baseUrl, versionedPath)
}

/**
 * Get complete asset URL from CDN or storage
 * @param path - Asset path
 * @param useStorage - Whether to use storage service instead of CDN
 * @returns Complete asset URL
 */
export const getAssetUrl = (path: string, useStorage = false): string => {
    const baseUrl = useStorage ? config.services.storageBaseUrl : config.services.cdnBaseUrl
    return joinUrl(baseUrl, path)
}

// Export individual config sections for convenience
export const { app, api, auth, features, services, gateway } = config

// Default export for compatibility
export default config