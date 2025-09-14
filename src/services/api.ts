import { getCurrentUser, login } from '@/auth/user-manager';
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

// API configuration interface
interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: new URL('/api', config.api.baseUrl).toString(),
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create(defaultConfig)

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const currentUser = await getCurrentUser();

    // Add authorization token if available
    if (currentUser?.access_token) {
      config.headers.Authorization = `Bearer ${currentUser.access_token}`
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
    const appStore = useAppStore()

    console.error('Response Error:', error)

    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          login() // Redirect to login on unauthorized
          break

        case 403:
          appStore.notifyError('Forbidden', 'You do not have permission to perform this action')
          break

        case 404:
          appStore.notifyError('Not Found', 'The requested resource was not found')
          break

        // case 422:
        //   // Validation errors
        //   if (data.errors && typeof data.errors === 'object') {
        //     const errorMessages = Object.values(data.errors).filter(err => err != null).flat().join(', ')
        //     appStore.notifyError('Validation Error', errorMessages)
        //   } else {
        //     appStore.notifyError('Validation Error', data.message || 'Invalid data provided')
        //   }
        //   break

        case 500:
          appStore.notifyError('Server Error', 'Internal server error occurred')
          break

        case 502:
        case 503:
        case 504:
          appStore.notifyError('Service Unavailable', 'Service is temporarily unavailable')
          break
      }
    } else if (error.request) {
      // Network error
      appStore.notifyError('Network Error', 'Unable to connect to the server')
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
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  // Generic POST request
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  // Generic PUT request
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  // Generic PATCH request
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  // Generic DELETE request
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // File upload
  async uploadFile<T = unknown>(url: string, file: File, onUploadProgress?: (progressEvent: unknown) => void): Promise<T> {
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
