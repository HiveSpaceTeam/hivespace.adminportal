import axios from 'axios'

// Base API configuration
const API_CONFIG = {
  baseURL: 'https://localhost:5001',
  timeout: 10000,
}

// Create axios instance
const apiClient = axios.create(API_CONFIG)

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // For now, using hardcoded token from your curl
    const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkE1NDA2QkNERkY4MTI1OTk3RTE3OEMwMjU1QzA5NDAzIiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxIiwibmJmIjoxNzU3ODQwNzU3LCJpYXQiOjE3NTc4NDA3NTcsImV4cCI6MTc1Nzg0Nzk1NywiYXVkIjoidXNlciIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJ1c2VyLmZ1bGxhY2Nlc3MiXSwiYW1yIjpbInB3ZCJdLCJjbGllbnRfaWQiOiJhZG1pbnBvcnRhbCIsInN1YiI6Ijk2MDY4MTA2LWRmYzItNDk3My0xMmVhLTA4ZGRmMDg0MGQyNCIsImF1dGhfdGltZSI6MTc1Nzc1NjI1MywiaWRwIjoibG9jYWwiLCJlbWFpbCI6InN5c2FkbWluQGhpdmVzcGFjZS5jb20iLCJuYW1lIjoiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJ1c2VybmFtZSI6InN5c2FkbWluIiwicm9sZSI6IlN5c3RlbUFkbWluIiwidXNlcl9zdGF0dXMiOiJBY3RpdmUiLCJiaXJ0aGRhdGUiOiIxOTgwLTAzLTEwIiwiZ2VuZGVyIjoiTWFsZSIsInNpZCI6IjBDMkM5NzUwOEQzMDRCM0MyMjk4QkY2MEVCRDg5MjA0IiwianRpIjoiMkQyNkYwOUU3Q0UzMUU2QzVGNEI1MzA4OTVEM0U2MDQifQ.DfQMgtZSB0UD8DNMhd4XC2xo8mefjZHSHmkPNcGELtPssgu-EFVS1io0HpOLzKl5ZPlMA-GwGPQCmxJA3Qe6X5wOrG0kHhZEMpS9FKrKUZ3UowWUzJZwMyLUx3x-imves1_9192DJhRpTh8R7ylXdu4kSwjLE3Wt6yknqTv4apM0ITk1s05huuhbdMYozJcZz1DuLsW5esNEdjVSQyVgiWS_pfTnki4ne1QF1KcfgtBC3zj5CjIg9GNgp-wSU0DZ7LTEkSo4Tu-pnYs5_pfU-NjiOiubGC6ZdgIrxwfKyoRZA3F38FTTrmunoQRdB5Huic63kGJtR5HADslSyYUjxw'

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token may be expired')
      // TODO: Handle token refresh or redirect to login
    }

    return Promise.reject(error)
  }
)

// Base API Service class for reusability
export class BaseApiService {
  protected client: any
  protected baseEndpoint: string

  constructor(baseEndpoint: string) {
    this.client = apiClient
    this.baseEndpoint = baseEndpoint
  }

  protected buildUrl(endpoint: string = ''): string {
    return `${this.baseEndpoint}${endpoint}`
  }

  // Generic GET method
  protected async get<T>(endpoint: string = '', config?: any): Promise<T> {
    const response = await this.client.get<T>(this.buildUrl(endpoint), config)
    return response.data
  }

  // Generic POST method
  protected async post<T>(endpoint: string = '', data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(this.buildUrl(endpoint), data, config)
    return response.data
  }

  // Generic PUT method
  protected async put<T>(endpoint: string = '', data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(this.buildUrl(endpoint), data, config)
    return response.data
  }

  // Generic PATCH method
  protected async patch<T>(endpoint: string = '', data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(this.buildUrl(endpoint), data, config)
    return response.data
  }

  // Generic DELETE method
  protected async delete<T>(endpoint: string = '', config?: any): Promise<T> {
    const response = await this.client.delete<T>(this.buildUrl(endpoint), config)
    return response.data
  }
}

// Export configured axios instance for direct use if needed
export { apiClient }
