# HiveSpace Admin Portal - Documentation

## 📚 Tài liệu kỹ thuật

Thư mục này chứa tất cả tài liệu kỹ thuật cho HiveSpace Admin Portal.

### 📋 Danh sách tài liệu:

#### **1. [Toast Notification System](./toast-notification-system.md)**
- Hệ thống thông báo popup hiện đại
- Hướng dẫn sử dụng chi tiết
- API reference và examples
- Customization và troubleshooting
- **[📍 Demo & Examples](./components/toast-demo-guide.md)** - Interactive demo tại `/demo/toast`

#### **2. [Modal Popup System](./components/modal-system.md)**
- Hệ thống modal dialog đầy đủ tính năng
- Confirm, Alert, Warning, Delete confirmations
- Custom content và loading states
- API reference và best practices
- **[📍 Demo & Examples](/demo/modal)** - Interactive demo tại `/demo/modal`

#### **3. [Pinia & Axios Setup](./README-pinia-axios.md)**
- State management với Pinia
- HTTP client với Axios
- API service configuration
- Best practices và examples

#### **4. [Environment Configuration](./env.example.md)**
- Environment variables setup
- API gateway configuration
- Development/Production settings

---

## 🚀 Quick Start

### **Toast Notifications:**
```typescript
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// Success notification
appStore.notifySuccess('Thành công!', 'Dữ liệu đã được lưu.')

// Error notification  
appStore.notifyError('Lỗi xảy ra', 'Không thể kết nối server.')
```

### **Modal Dialogs:**
```vue
<template>
  <ConfirmModal
    v-model="showModal"
    title="Xác nhận xóa"
    message="Bạn có chắc chắn muốn xóa item này?"
    confirm-text="Xóa"
    cancel-text="Hủy"
    variant="danger"
    @confirm="handleDelete"
  />
</template>

<script setup lang="ts">
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const showModal = ref(false)
const handleDelete = () => {
  // Delete logic here
}
</script>
```

### **API Calls:**
```typescript
import { userService } from '@/services/user.service'

// Get users
const users = await userService.getUsers()

// Create user
const newUser = await userService.createUser(userData)
```

### **State Management:**
```vue
<script setup lang="ts">
import { useAuthStore, useUserStore } from '@/stores'

const authStore = useAuthStore()
const userStore = useUserStore()

// Login
await authStore.login({ email: 'user@example.com', password: 'password' })

// Fetch users
await userStore.fetchUsers()
</script>
```

---

## 📁 Cấu trúc Project

```
src/
├── components/           # Vue components
│   ├── common/          # Common UI components
│   │   ├── Toast.vue         # Toast notification component
│   │   ├── ConfirmModal.vue  # Modal dialog component
│   │   └── ...
│   └── layout/          # Layout components
├── stores/              # Pinia stores
│   ├── app.ts          # App-wide state (notifications, theme)
│   ├── auth.ts         # Authentication state
│   └── user.ts         # User management state
├── services/            # API services
│   ├── api.ts          # Axios configuration
│   ├── auth.service.ts # Authentication APIs
│   └── user.service.ts # User management APIs
├── config/              # Configuration
│   └── environment.ts  # Environment variables
└── i18n/               # Internationalization
    └── locales/        # Language files
```

---

## 🔧 Development

### **Setup:**
```bash
npm install
npm run dev
```

### **Build:**
```bash
npm run build
```

### **Linting:**
```bash
npm run lint
```

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:
- Kiểm tra documentation trong thư mục này
- Xem troubleshooting guides
- Contact team development

---

*HiveSpace Admin Portal - 2025*
