# Toast Notification System - Hướng Dẫn Sử Dụng

## 📋 Tổng quan

Toast Notification System là hệ thống thông báo popup hiện đại, xuất hiện từ góc top-right màn hình và tự động biến mất sau một khoảng thời gian.

### ✨ Tính năng chính:
- ✅ **4 loại thông báo**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Tự động biến mất sau 5 giây
- ✅ **Manual close**: Đóng thủ công bằng nút X
- ✅ **Progress bar**: Hiển thị thời gian countdown
- ✅ **Stack vertically**: Nhiều toast xếp chồng đẹp mắt
- ✅ **Smooth animations**: Slide-in/out mượt mà
- ✅ **Dark mode support**: Hỗ trợ giao diện tối
- ✅ **Mobile responsive**: Tương thích mobile
- ✅ **High z-index**: Luôn hiển thị trên cùng

---

## 🏗️ Cấu trúc Components

### 1. **Toast.vue**
Component cơ bản hiển thị một toast notification đơn lẻ.

**Props:**
```typescript
interface ToastProps {
  id: string                    // ID duy nhất
  variant: 'success' | 'error' | 'warning' | 'info'  // Loại toast
  title: string                 // Tiêu đề chính
  message?: string              // Nội dung chi tiết (optional)
  duration?: number             // Thời gian hiển thị (ms, default: 5000)
  showLink?: boolean            // Hiển thị link (default: false)
  linkHref?: string            // URL của link
  linkText?: string            // Text của link
  showProgress?: boolean       // Hiển thị progress bar (default: true)
}
```

**Events:**
```typescript
interface ToastEmits {
  close: [id: string]  // Emit khi toast được đóng
}
```

### 2. **ToastContainer.vue**
Container quản lý và hiển thị tất cả toast notifications.

- **Position**: Fixed top-right (top: 16px, right: 16px)
- **Z-index**: 9999 (luôn hiển thị trên cùng)
- **Spacing**: 12px giữa các toast
- **Teleport**: Render trực tiếp vào body

---

## 🚀 Cách sử dụng

### 1. **Setup (Đã được cài đặt sẵn)**

ToastContainer đã được thêm vào `App.vue`:
```vue
<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
    <ModalManager />
    <!-- Global toast notifications -->
    <ToastContainer />
  </ThemeProvider>
</template>
```

### 2. **Sử dụng trong Component**

Import và sử dụng Pinia store:
```vue
<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// Success notification
const showSuccess = () => {
  appStore.notifySuccess(
    'Thành công!',
    'Dữ liệu đã được lưu thành công.'
  )
}

// Error notification
const showError = () => {
  appStore.notifyError(
    'Lỗi xảy ra',
    'Không thể kết nối với máy chủ. Vui lòng thử lại.'
  )
}

// Warning notification
const showWarning = () => {
  appStore.notifyWarning(
    'Cảnh báo',
    'Một số trường thông tin chưa được điền đầy đủ.'
  )
}

// Info notification
const showInfo = () => {
  appStore.notifyInfo(
    'Thông tin',
    'Hệ thống sẽ bảo trì vào 2:00 AM ngày mai.'
  )
}
</script>
```

### 3. **Template Usage**
```vue
<template>
  <div class="space-y-4">
    <Button @click="showSuccess" variant="primary">
      Show Success Toast
    </Button>
    
    <Button @click="showError" variant="danger">
      Show Error Toast
    </Button>
    
    <Button @click="showWarning" variant="warning">
      Show Warning Toast
    </Button>
    
    <Button @click="showInfo" variant="secondary">
      Show Info Toast
    </Button>
  </div>
</template>
```

---

## 🎨 Customization

### 1. **Thay đổi thời gian hiển thị**
```typescript
// Hiển thị trong 10 giây
appStore.addNotification({
  type: 'success',
  title: 'Thành công!',
  message: 'Dữ liệu đã được lưu.',
  duration: 10000  // 10 seconds
})

// Không tự động đóng (duration = 0)
appStore.addNotification({
  type: 'error',
  title: 'Lỗi nghiêm trọng',
  message: 'Vui lòng liên hệ admin.',
  duration: 0  // Won't auto-close
})
```

### 2. **Thêm link trong toast**
```typescript
appStore.addNotification({
  type: 'info',
  title: 'Cập nhật mới',
  message: 'Có phiên bản mới của ứng dụng.',
  showLink: true,
  linkText: 'Xem chi tiết',
  linkHref: '/updates'
})
```

### 3. **Đóng toast thủ công**
```typescript
// Lấy ID của toast vừa tạo
const toastId = appStore.notifySuccess('Thành công!', 'Dữ liệu đã được lưu.')

// Đóng toast sau 2 giây
setTimeout(() => {
  appStore.removeNotification(toastId)
}, 2000)
```

---

## 🎯 Use Cases Phổ Biến

### 1. **Form Submission**
```typescript
const handleSubmit = async () => {
  try {
    appStore.setLoading(true)
    await submitForm(formData)
    
    appStore.notifySuccess(
      'Gửi thành công!',
      'Biểu mẫu đã được gửi và đang được xử lý.'
    )
  } catch (error) {
    appStore.notifyError(
      'Gửi thất bại',
      'Có lỗi xảy ra khi gửi biểu mẫu. Vui lòng thử lại.'
    )
  } finally {
    appStore.setLoading(false)
  }
}
```

### 2. **API Error Handling**
```typescript
// Trong API interceptor (đã setup sẵn)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appStore = useAppStore()
    
    if (error.response?.status === 401) {
      appStore.notifyError(
        'Phiên đăng nhập hết hạn',
        'Vui lòng đăng nhập lại để tiếp tục.'
      )
    } else if (error.response?.status === 500) {
      appStore.notifyError(
        'Lỗi máy chủ',
        'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
      )
    }
    
    return Promise.reject(error)
  }
)
```

### 3. **User Actions**
```typescript
const deleteUser = async (userId: string) => {
  try {
    await userService.deleteUser(userId)
    
    appStore.notifySuccess(
      'Xóa thành công',
      'Người dùng đã được xóa khỏi hệ thống.'
    )
    
    // Refresh user list
    await fetchUsers()
  } catch (error) {
    appStore.notifyError(
      'Xóa thất bại',
      'Không thể xóa người dùng. Vui lòng thử lại.'
    )
  }
}
```

---

## 🎨 Styling & Theming

### Toast Variants:

#### **Success** (Green)
```css
.toast-success {
  border-color: rgb(34 197 94);      /* border-success-500 */
  background: rgb(240 253 244);      /* bg-success-50 */
  color: rgb(34 197 94);             /* text-success-500 */
}
```

#### **Error** (Red)
```css
.toast-error {
  border-color: rgb(239 68 68);      /* border-error-500 */
  background: rgb(254 242 242);      /* bg-error-50 */
  color: rgb(239 68 68);             /* text-error-500 */
}
```

#### **Warning** (Yellow)
```css
.toast-warning {
  border-color: rgb(245 158 11);     /* border-warning-500 */
  background: rgb(255 251 235);      /* bg-warning-50 */
  color: rgb(245 158 11);            /* text-warning-500 */
}
```

#### **Info** (Blue)
```css
.toast-info {
  border-color: rgb(59 130 246);     /* border-blue-light-500 */
  background: rgb(239 246 255);      /* bg-blue-light-50 */
  color: rgb(59 130 246);            /* text-blue-light-500 */
}
```

### Dark Mode:
Tất cả variants đều có dark mode variants với opacity 30% cho border và 15% cho background.

---

## 🔧 Advanced Usage

### 1. **Tích hợp với i18n**
```typescript
const showLocalizedToast = () => {
  appStore.notifySuccess(
    t('notifications.success.title'),
    t('notifications.success.message', { 
      username: currentUser.name 
    })
  )
}
```

### 2. **Conditional Toasts**
```typescript
const handleAction = async () => {
  const result = await performAction()
  
  if (result.warning) {
    appStore.notifyWarning(
      'Hoàn thành với cảnh báo',
      result.warning
    )
  } else {
    appStore.notifySuccess(
      'Hoàn thành',
      'Thao tác đã được thực hiện thành công.'
    )
  }
}
```

### 3. **Batch Notifications**
```typescript
const processBatch = async (items: any[]) => {
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  )
  
  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  
  if (failed === 0) {
    appStore.notifySuccess(
      'Xử lý thành công',
      `Đã xử lý thành công ${successful} mục.`
    )
  } else {
    appStore.notifyWarning(
      'Xử lý hoàn tất',
      `Thành công: ${successful}, Thất bại: ${failed} mục.`
    )
  }
}
```

---

## 📱 Mobile Responsiveness

Toast system tự động responsive cho mobile:
- **Desktop**: max-width: 384px (max-w-sm)
- **Mobile**: Full width với padding phù hợp
- **Position**: Luôn ở top-right với khoảng cách phù hợp
- **Stack**: Vertical spacing điều chỉnh theo screen size

---

## 🛠️ Troubleshooting

### **Toast không hiển thị:**
1. Kiểm tra ToastContainer đã được thêm vào App.vue
2. Kiểm tra z-index không bị che bởi elements khác
3. Đảm bảo Pinia store đã được setup đúng

### **Toast bị cắt trên mobile:**
1. Kiểm tra viewport meta tag
2. Đảm bảo parent containers không có overflow: hidden

### **Animation không mượt:**
1. Kiểm tra CSS transitions
2. Đảm bảo browser hỗ trợ transform3d

### **Multiple toasts overlap:**
1. Kiểm tra space-y-3 class trong ToastContainer
2. Đảm bảo mỗi toast có unique key

---

## 📚 API Reference

### **useAppStore Methods:**

```typescript
// Basic notifications
notifySuccess(title: string, message?: string, duration?: number): string
notifyError(title: string, message?: string, duration?: number): string  
notifyWarning(title: string, message?: string, duration?: number): string
notifyInfo(title: string, message?: string, duration?: number): string

// Advanced notification
addNotification(options: NotificationOptions): string

// Management
removeNotification(id: string): void
clearAllNotifications(): void

// State
notifications: Notification[]  // Reactive array of current toasts
```

### **NotificationOptions Interface:**
```typescript
interface NotificationOptions {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  showLink?: boolean
  linkHref?: string
  linkText?: string
}
```

---

## 🚀 Examples

Xem thêm examples trong:
- `src/views/Accounts/AdminManagement.vue` - Real implementation
- `src/stores/app.ts` - Store implementation
- `src/components/common/Toast.vue` - Component source

---

*Được tạo bởi HiveSpace Admin Portal Team - 2024*
