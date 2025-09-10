// Environment configuration
export const environment = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },

  // Authentication
  auth: {
    callbackUrl: import.meta.env.VITE_AUTH_CALLBACK_URL || 'http://localhost:5173/auth/callback',
  },

  // Application
  app: {
    name: import.meta.env.VITE_APP_NAME || 'HiveSpace Admin Portal',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },

  // Feature Flags
  features: {
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },

  // External Services
  services: {
    storageBaseUrl: import.meta.env.VITE_STORAGE_BASE_URL || 'https://storage.hivespace.com',
    cdnBaseUrl: import.meta.env.VITE_CDN_BASE_URL || 'https://cdn.hivespace.com',
  },

  // Microservices Endpoints (Optional overrides)
  microservices: {
    authService: import.meta.env.VITE_AUTH_SERVICE_URL,
    userService: import.meta.env.VITE_USER_SERVICE_URL,
    adminService: import.meta.env.VITE_ADMIN_SERVICE_URL,
    notificationService: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
  },
}

// Helper functions
export const isDevelopment = () => environment.app.environment === 'development'
export const isProduction = () => environment.app.environment === 'production'
export const isStaging = () => environment.app.environment === 'staging'

// API endpoint builder with microservice override support
export const buildApiUrl = (path: string, service?: keyof typeof environment.microservices): string => {
  // Check if there's a specific microservice URL override
  if (service && environment.microservices[service]) {
    return `${environment.microservices[service]}${path}`
  }

  // Use default API gateway URL
  return `${environment.api.baseUrl}${path}`
}

// Export environment configuration
export default environment
