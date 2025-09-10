# Modal Popup System

## Tổng quan

HiveSpace Admin Portal cung cấp hệ thống Modal đầy đủ tính năng với component `ConfirmModal.vue` - một giải pháp linh hoạt cho các tình huống cần confirmation, alert, và user interaction.

## 🎯 Tính năng chính

### Modal Types
- **Confirm Dialog** - Xác nhận hành động với OK/Cancel
- **Alert Dialog** - Thông báo với single OK button
- **Warning Dialog** - Cảnh báo với proceed/cancel options
- **Delete Confirmation** - Xác nhận xóa với Delete/Keep buttons
- **Yes/No Dialog** - Lựa chọn binary với Yes/No
- **Save/Discard Dialog** - 3 buttons: Save/Cancel/Discard
- **Loading Modal** - Async operations với loading state
- **Custom Content Modal** - Form hoặc custom content
- **Auto-sized Modal** - Tự động điều chỉnh kích thước theo nội dung

### Visual Features
- ✅ **Flexible positioning** - có thể đặt ở vị trí bất kỳ
- ✅ **Vertical layout** - buttons nằm dưới content
- ✅ **Transparent backdrop** với subtle overlay
- ✅ **Smooth animations** (fade in/out, scale effects)
- ✅ **Icon variants** với rounded styling cho từng loại modal
- ✅ **Color coding** theo semantic meaning
- ✅ **Multiple sizes** (sm, md, lg, xl)
- ✅ **Dark mode support** đầy đủ

### Technical Features
- ✅ **Teleport to body** level rendering
- ✅ **v-model binding** cho show/hide control
- ✅ **Loading states** với disabled buttons
- ✅ **Backdrop click** control (có thể tắt)
- ✅ **Custom slots** cho advanced content
- ✅ **TypeScript support** với full type definitions
- ✅ **Accessibility** ready với proper focus management

## 📚 Cách sử dụng

### Import Component

```vue
<script setup lang="ts">
import ConfirmModal from '@/components/common/ConfirmModal.vue'
</script>
```

### Basic Usage

#### 1. Simple Confirm Dialog

```vue
<template>
  <div>
    <Button @click="showConfirmModal = true">Show Confirm</Button>
    
    <ConfirmModal
      v-model="showConfirmModal"
      title="Confirm Action"
      message="Are you sure you want to proceed with this action?"
      confirm-text="Yes, Proceed"
      cancel-text="Cancel"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showConfirmModal = ref(false)

const handleConfirm = () => {
  // Handle confirm logic
  console.log('User confirmed')
}

const handleCancel = () => {
  // Handle cancel logic
  console.log('User cancelled')
}
</script>
```

#### 2. Delete Confirmation

```vue
<template>
  <ConfirmModal
    v-model="showDeleteModal"
    variant="danger"
    title="Delete Item"
    message="This action cannot be undone. Are you sure you want to delete this item?"
    confirm-text="Delete"
    cancel-text="Keep"
    confirm-variant="danger"
    @confirm="deleteItem"
    @cancel="() => console.log('Delete cancelled')"
  />
</template>

<script setup lang="ts">
const deleteItem = async () => {
  try {
    // API call to delete item
    await apiClient.delete(`/items/${itemId}`)
    
    // Show success notification
    appStore.notifySuccess('Deleted!', 'Item has been deleted successfully.')
  } catch (error) {
    appStore.notifyError('Delete Failed', 'Unable to delete item.')
  }
}
</script>
```

#### 3. Three Button Modal (Save/Cancel/Discard)

```vue
<template>
  <ConfirmModal
    v-model="showSaveModal"
    variant="warning"
    title="Unsaved Changes"
    message="You have unsaved changes that will be lost if you navigate away."
    confirm-text="Save"
    cancel-text="Cancel"
    third-text="Discard"
    confirm-variant="primary"
    third-variant="danger"
    @confirm="saveChanges"
    @third="discardChanges"
    @cancel="() => console.log('Stay on page')"
  />
</template>

<script setup lang="ts">
const saveChanges = async () => {
  try {
    // Save form data
    await saveFormData()
    appStore.notifySuccess('Saved!', 'Changes saved successfully.')
    
    // Navigate away
    router.push('/next-page')
  } catch (error) {
    appStore.notifyError('Save Failed', 'Unable to save changes.')
  }
}

const discardChanges = () => {
  // Clear form or reset
  resetForm()
  appStore.notifyInfo('Discarded', 'Changes have been discarded.')
  
  // Navigate away
  router.push('/next-page')
}
</script>
```

#### 4. Loading State Modal

```vue
<template>
  <ConfirmModal
    v-model="showProcessingModal"
    variant="info"
    title="Processing Data"
    message="Please wait while we process your request. This may take a few moments."
    confirm-text="Processing..."
    :cancel-text="null"
    :loading="isProcessing"
    :close-on-backdrop="false"
    @confirm="startProcessing"
  />
</template>

<script setup lang="ts">
const isProcessing = ref(false)
const showProcessingModal = ref(false)

const startProcessing = async () => {
  isProcessing.value = true
  
  try {
    // Simulate long-running process
    await processLargeDataset()
    
    // Close modal and show success
    showProcessingModal.value = false
    appStore.notifySuccess('Complete!', 'Data processed successfully.')
  } catch (error) {
    appStore.notifyError('Processing Failed', error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>
```

#### 5. Custom Content Modal

```vue
<template>
  <ConfirmModal
    v-model="showCustomModal"
    variant="info"
    size="lg"
    title="User Information"
    confirm-text="Save"
    cancel-text="Cancel"
    @confirm="handleCustomSave"
    @cancel="resetCustomForm"
  >
    <!-- Custom slot content -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name *
        </label>
        <input 
          v-model="userForm.name"
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter full name"
          :class="{ 'border-red-500': errors.name }"
        >
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input 
          v-model="userForm.email"
          type="email" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter email address"
          :class="{ 'border-red-500': errors.email }"
        >
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Role *
        </label>
        <select 
          v-model="userForm.role"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          :class="{ 'border-red-500': errors.role }"
        >
          <option value="">Select a role</option>
          <option value="admin">Administrator</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
      </div>
    </div>
  </ConfirmModal>
</template>

<script setup lang="ts">
const userForm = reactive({
  name: '',
  email: '',
  role: ''
})

const errors = reactive({
  name: '',
  email: '',
  role: ''
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!userForm.name) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!userForm.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
    errors.email = 'Email format is invalid'
    isValid = false
  }
  
  if (!userForm.role) {
    errors.role = 'Role is required'
    isValid = false
  }
  
  return isValid
}

const handleCustomSave = async () => {
  if (!validateForm()) {
    appStore.notifyError('Validation Error', 'Please fix the errors and try again.')
    return
  }
  
  try {
    // Save user data
    await createUser(userForm)
    
    // Success and close
    appStore.notifySuccess('User Created!', `User ${userForm.name} has been created successfully.`)
    showCustomModal.value = false
    resetCustomForm()
  } catch (error) {
    appStore.notifyError('Creation Failed', 'Unable to create user.')
  }
}

const resetCustomForm = () => {
  userForm.name = ''
  userForm.email = ''
  userForm.role = ''
  Object.keys(errors).forEach(key => errors[key] = '')
}
</script>
```

## 📋 API Reference

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `modelValue` | `boolean` | - | ✅ | Show/hide modal state |
| `variant` | `ModalVariant` | `'confirm'` | ❌ | Modal type and styling |
| `size` | `ModalSize` | `'md'` | ❌ | Modal size |
| `title` | `string` | - | ❌ | Modal header title (optional) |
| `message` | `string` | - | ❌ | Modal body message |
| `showIcon` | `boolean` | `true` | ❌ | Show/hide variant icon |
| `confirmText` | `string` | `'Confirm'` | ❌ | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | ❌ | Cancel button text |
| `thirdText` | `string` | - | ❌ | Third button text |
| `confirmVariant` | `ButtonVariant` | `'primary'` | ❌ | Confirm button style |
| `thirdVariant` | `ButtonVariant` | `'secondary'` | ❌ | Third button style |
| `loading` | `boolean` | `false` | ❌ | Loading state |
| `closeOnBackdrop` | `boolean` | `true` | ❌ | Allow backdrop click to close |
| `autoSize` | `boolean` | `false` | ❌ | Auto-size modal based on content |

### Types

```typescript
export type ModalVariant = 'confirm' | 'alert' | 'warning' | 'danger' | 'info' | 'success'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline'
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@update:modelValue` | `boolean` | Modal visibility changed |
| `@confirm` | - | Confirm button clicked |
| `@cancel` | - | Cancel button clicked |
| `@third` | - | Third button clicked |
| `@close` | - | Modal closed (any method) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Custom content area (appears after message) |

## 🎨 Styling & Variants

### Modal Variants

| Variant | Icon | Color | Use Case |
|---------|------|-------|----------|
| `confirm` | ✅ | Green | General confirmations |
| `alert` | ℹ️ | Blue | Information alerts |
| `warning` | ⚠️ | Yellow | Warning messages |
| `danger` | 🗑️ | Red | Destructive actions |
| `info` | ℹ️ | Blue | Informational content |
| `success` | ✅ | Green | Success confirmations |

### Modal Sizes

| Size | Min Width | Use Case |
|------|-----------|----------|
| `sm` | `280px` | Simple confirmations |
| `md` | `320px` | Standard dialogs |
| `lg` | `480px` | Forms and detailed content |
| `xl` | `640px` | Complex forms or data |

### Button Variants

| Variant | Light Theme | Dark Theme | Use Case |
|---------|-------------|------------|----------|
| `primary` | Blue solid | Blue solid (darker) | Main actions |
| `secondary` | Gray solid | Gray solid (lighter) | Secondary actions |
| `danger` | Red solid | Red solid (darker) | Destructive actions |
| `warning` | Yellow solid | Yellow solid (darker) | Caution actions |
| `success` | Green solid | Green solid (darker) | Positive actions |
| `outline` | Gray border | Gray border (lighter) | Cancel/neutral actions |

## 🔧 Best Practices

### 1. Modal Content
- **Keep titles short** và descriptive
- **Use clear messaging** để user hiểu action consequences
- **Provide context** về what will happen after confirm

### 2. Button Text
- **Use action verbs** thay vì generic "OK"
- **Be specific**: "Delete Item" thay vì "Delete"
- **Match the action** với button variant (red cho delete)

### 3. Loading States
- **Disable backdrop click** khi processing
- **Show progress indication** cho long operations
- **Handle errors gracefully** với proper notifications

### 4. Accessibility
- **Use semantic HTML** trong custom slots
- **Provide proper labels** cho form inputs
- **Handle focus management** correctly

### 5. UX Guidelines
- **Use modals sparingly** - không overuse
- **Prefer inline confirmations** cho simple actions
- **Reserve modals** cho important decisions
- **Provide clear escape routes** (cancel, X button)

## 🚨 Common Pitfalls

### ❌ Tránh những lỗi này:

1. **Modal stacking** - Tránh mở modal trong modal
2. **Missing validation** - Luôn validate trước khi submit
3. **Poor error handling** - Handle network errors gracefully
4. **Inconsistent button text** - Use consistent language
5. **Too many modals** - Consider inline alternatives
6. **Hard-coded positioning** - Sử dụng layout system để quản lý positioning

### ✅ Best approach:

1. **Single modal flow** - Một modal tại một thời điểm
2. **Client-side validation** - Validate ngay trong modal
3. **Loading states** - Show progress cho async operations
4. **Consistent UX** - Same patterns across app
5. **Alternative patterns** - Consider Toast cho simple confirmations
6. **Flexible layout** - Tận dụng vertical layout cho nội dung phức tạp
7. **Auto-sizing** - Sử dụng `autoSize` property khi nội dung thay đổi động

## 📱 Responsive Behavior

Modal system tự động adapt cho mobile devices:

- **Full width** trên mobile screens
- **Proper spacing** với padding responsive
- **Touch-friendly** button sizes
- **Readable text** với appropriate font sizes
- **Keyboard support** cho accessibility

## 🔗 Related Components

- **[Toast Notifications](./toast-system.md)** - Cho simple confirmations
- **[Button Component](./button-system.md)** - Cho trigger actions
- **[Form Components](./form-system.md)** - Cho custom modal content

## 🎯 Demo & Examples

Xem full interactive demo tại: **[/demo/modal](/demo/modal)**

Demo bao gồm:
- ✅ Tất cả modal variants
- ✅ Loading states examples
- ✅ Custom content forms
- ✅ API integration patterns
- ✅ Best practice examples

---

**💡 Pro tip:** Combine Modal với Toast notifications để tạo complete user feedback flow - Modal cho confirmations, Toast cho results!
