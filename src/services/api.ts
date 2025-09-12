import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { environment } from '@/config/environment'

// API configuration interface
interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: environment.api.baseUrl,
  timeout: environment.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create(defaultConfig)

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // Add authorization token if available
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // Add correlation ID for tracing across microservices
    config.headers['X-Correlation-ID'] = generateCorrelationId()

    // Add request timestamp
    config.headers['X-Request-Timestamp'] = new Date().toISOString()

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)

    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const appStore = useAppStore()

    console.error('Response Error:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          if (authStore.refreshToken && !error.config._retry && !error.config.url?.includes('/auth/refresh')) {
            error.config._retry = true
            try {
              await authStore.refreshAccessToken()
              // Retry the original request with new token
              error.config.headers.Authorization = `Bearer ${authStore.token}`
              return apiClient.request(error.config)
            } catch (refreshError) {
              // Refresh failed, redirect to login
              authStore.clearAuth()
              appStore.notifyError('Session Expired', 'Please login again')
              // TODO: Redirect to login page
              console.log('Redirecting to login...')
            }
          } else {
            authStore.clearAuth()
            appStore.notifyError('Unauthorized', 'Access denied')
          }
          break

        case 403:
          appStore.notifyError('Forbidden', 'You do not have permission to perform this action')
          break

        case 404:
          appStore.notifyError('Not Found', 'The requested resource was not found')
          break

        case 422:
          // Validation errors
          if (data.errors && typeof data.errors === 'object') {
            const errorMessages = Object.values(data.errors).filter(err => err != null).flat().join(', ')
            appStore.notifyError('Validation Error', errorMessages)
          } else {
            appStore.notifyError('Validation Error', data.message || 'Invalid data provided')
          }
          break

        case 500:
          appStore.notifyError('Server Error', 'Internal server error occurred')
          break

        case 502:
        case 503:
        case 504:
          appStore.notifyError('Service Unavailable', 'Service is temporarily unavailable')
          break

        default:
          appStore.notifyError('Error', data.message || 'An unexpected error occurred')
      }
    } else if (error.request) {
      // Network error
      appStore.notifyError('Network Error', 'Unable to connect to the server')
    } else {
      appStore.notifyError('Error', error.message || 'An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

// Generate correlation ID for request tracing
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// API service class
class ApiService {
  private client: AxiosInstance

  constructor(client: AxiosInstance) {
    this.client = client
  }

  // Generic GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  // Generic POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  // Generic PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  // Generic PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  // Generic DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // File upload
  async uploadFile<T = any>(url: string, file: File, onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })

    return response.data
  }

  // Download file
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}

// Create and export the API service instance
export const apiService = new ApiService(apiClient)

// Export the axios instance for direct use if needed
export { apiClient }

// Export types
export type { ApiConfig }
