# Pinia & Axios Setup Documentation

## Tổng quan

Project đã được thiết lập với:
- **Pinia** cho state management
- **Axios** cho HTTP requests với .NET Core microservices API gateway

## Cấu trúc thư mục

```
src/
├── stores/           # Pinia stores
│   ├── index.ts      # Export tất cả stores
│   ├── auth.ts       # Authentication store
│   ├── user.ts       # User management store
│   └── app.ts        # App-wide state store
├── services/         # API services
│   ├── index.ts      # Export tất cả services
│   ├── api.ts        # Axios configuration & base API service
│   ├── auth.service.ts    # Authentication API calls
│   ├── user.service.ts    # User management API calls
│   └── admin.service.ts   # Admin functionality API calls
└── config/
    ├── environment.ts     # Environment configuration
    └── env.example.md     # Environment variables guide
```

## Cách sử dụng Pinia Stores

### 1. Authentication Store

```vue
<template>
  <div>
    <div v-if="authStore.isLoading">Loading...</div>
    <div v-else-if="authStore.isAuthenticated">
      Welcome, {{ authStore.currentUser?.name }}!
      <button @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <button @click="handleLogin">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login({
      email: 'user@example.com',
      password: 'password123'
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
```

### 2. User Store

```vue
<template>
  <div>
    <div v-if="userStore.isLoading">Loading users...</div>
    <div v-else-if="userStore.error">{{ userStore.error }}</div>
    <div v-else>
      <ul>
        <li v-for="user in userStore.users" :key="user.id">
          {{ user.name }} - {{ user.email }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  try {
    await userStore.fetchUsers({
      pageNumber: 1,
      pageSize: 10
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>
```

### 3. App Store (Notifications)

```vue
<template>
  <div>
    <button @click="showSuccess">Show Success</button>
    <button @click="showError">Show Error</button>
    <button @click="toggleTheme">Toggle Theme</button>
    
    <!-- Notification display -->
    <div v-for="notification in appStore.notifications" :key="notification.id"
         :class="['notification', notification.type]">
      <h4>{{ notification.title }}</h4>
      <p>{{ notification.message }}</p>
      <button @click="appStore.removeNotification(notification.id)">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const showSuccess = () => {
  appStore.notifySuccess('Success!', 'Operation completed successfully')
}

const showError = () => {
  appStore.notifyError('Error!', 'Something went wrong')
}

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>
```

## Cách sử dụng API Services

### 1. Direct Service Usage

```vue
<script setup lang="ts">
import { userService } from '@/services/user.service'
import { authService } from '@/services/auth.service'

// Sử dụng user service trực tiếp
const fetchUserDetails = async (userId: string) => {
  try {
    const user = await userService.getUserById(userId)
    console.log('User details:', user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
}

// Sử dụng auth service
const updateProfile = async (profileData: any) => {
  try {
    const updatedProfile = await authService.updateProfile(profileData)
    console.log('Profile updated:', updatedProfile)
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}
</script>
```

### 2. File Upload

```vue
<template>
  <input type="file" @change="handleFileUpload" />
  <div v-if="uploadProgress">Upload progress: {{ uploadProgress }}%</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userService } from '@/services/user.service'

const uploadProgress = ref(0)

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  try {
    const result = await userService.uploadAvatar('user-id', file, (progressEvent) => {
      uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    })
    console.log('Upload successful:', result)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
</script>
```

## Environment Configuration

### 1. Tạo file .env

Tạo file `.env` trong root directory:

```env
VITE_API_BASE_URL=https://your-api-gateway.com/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=HiveSpace Admin Portal
VITE_ENABLE_DEBUG=true
```

### 2. Sử dụng Environment Config

```typescript
import { environment, buildApiUrl } from '@/config/environment'

// Sử dụng config
console.log('API Base URL:', environment.api.baseUrl)
console.log('App Name:', environment.app.name)

// Build API URL với microservice override
const authUrl = buildApiUrl('/auth/login', 'authService')
```

## Best Practices

### 1. Error Handling

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()

const handleAction = async () => {
  try {
    await authStore.login({ email: 'user@example.com', password: 'password' })
    appStore.notifySuccess('Login Successful', 'Welcome back!')
  } catch (error: any) {
    appStore.notifyError('Login Failed', error.message || 'Please try again')
  }
}
</script>
```

### 2. Loading States

```vue
<template>
  <div>
    <button :disabled="authStore.isLoading" @click="handleAction">
      <span v-if="authStore.isLoading">Loading...</span>
      <span v-else>Login</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
```

### 3. Reactive Data

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Computed properties tự động reactive
const isLoggedIn = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.currentUser?.name || 'Guest')
</script>
```

## API Interceptors

Axios đã được cấu hình với:

- **Request Interceptor**: Tự động thêm authorization token, correlation ID
- **Response Interceptor**: Xử lý errors (401, 403, 500...), token refresh
- **Error Handling**: Hiển thị notifications cho các lỗi API

## Features

- ✅ Automatic token refresh
- ✅ Request/Response logging
- ✅ Global error handling
- ✅ File upload/download support
- ✅ Correlation ID tracking
- ✅ Environment configuration
- ✅ TypeScript support
- ✅ Reactive state management
