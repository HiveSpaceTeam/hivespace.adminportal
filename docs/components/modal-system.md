# Modal Popup System

## Tổng quan

HiveSpace Admin Portal cung cấp hệ thống Modal toàn diện với hai thành phần chính:

- **ConfirmModal.vue** - Component modal đơn giản cho confirmations
- **Modal System** - Hệ thống modal toàn cục với `useModal` + `ModalManager` + `ModalWrapper`
- **useConfirmModal** - Composable cung cấp API dễ sử dụng cho tất cả modal patterns

## 🏗️ Kiến trúc hệ thống

### 1. ConfirmModal Component

Component standalone cho các confirmation dialogs đơn giản với layout tối ưu:

- Icon + message layout ngang
- Buttons căn phải (confirm trước, cancel sau)
- Emit system với payload result

### 2. Modal Infrastructure

- **useModal** - Global modal state management
- **ModalManager** - Dynamic component rendering
- **ModalWrapper** - Base modal với vue-final-modal
- **useConfirmModal** - High-level API cho common patterns

## 🎯 Tính năng chính

### Modal Types

- **Confirm Dialog** - Xác nhận hành động với Confirm/Cancel
- **Alert Dialog** - Thông báo với single OK button  
- **Warning Dialog** - Cảnh báo với Continue/Cancel options
- **Delete Confirmation** - Xác nhận xóa với Delete/Cancel buttons
- **Save/Discard Dialog** - 3 buttons: Save/Cancel/Discard
- **Loading Modal** - Async operations với loading state
- **Custom Content Modal** - Form hoặc custom content trong ModalWrapper

### Visual Features

- ✅ **Centered positioning** với backdrop overlay
- ✅ **Horizontal icon+content layout** trong ConfirmModal
- ✅ **Reverse button order** (confirm trước, cancel sau)
- ✅ **Smooth animations** (fade transitions)
- ✅ **Icon variants** với semantic coloring cho từng loại modal
- ✅ **Multiple sizes** (sm: 280px, md: 320px, lg: 480px, xl: 640px)
- ✅ **Dark mode support** đầy đủ
- ✅ **vue-final-modal integration** cho complex modals

### Technical Features

- ✅ **Teleport to body** level rendering
- ✅ **Promise-based API** với async/await support
- ✅ **Loading states** với disabled buttons
- ✅ **Backdrop click** và ESC key support (ModalWrapper)
- ✅ **Custom slots** cho advanced content
- ✅ **TypeScript support** với full type definitions
- ✅ **Global state management** tránh modal stacking

## 📚 Cách sử dụng

### Import Composable

```vue
<script setup lang="ts">
import { useConfirmModal } from '@/composables/useConfirmModal'
</script>
```

### Basic Usage

#### 1. Simple Confirm Dialog

```vue
<template>
  <div>
    <Button @click="handleAction">Confirm Action</Button>
  </div>
</template>

<script setup lang="ts">
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'

const { confirm } = useConfirmModal()
const appStore = useAppStore()

const handleAction = async () => {
  const confirmed = await confirm(
    'Confirm Action',
    'Are you sure you want to proceed with this action?'
  )

  if (confirmed) {
    // Handle confirmation
    appStore.notifySuccess('Success!', 'Action completed successfully.')
  }
}
</script>
```

#### 2. Delete Confirmation

```vue
<template>
  <Button @click="handleDelete" variant="danger">Delete Item</Button>
</template>

<script setup lang="ts">
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'

const { deleteConfirm } = useConfirmModal()
const appStore = useAppStore()

const handleDelete = async () => {
  const confirmed = await deleteConfirm(
    'Delete Item',
    'This action cannot be undone. Are you sure you want to delete this item?'
  )

  if (confirmed) {
    try {
      // API call to delete item
      await apiClient.delete(`/items/${itemId}`)
      
      // Show success notification
      appStore.notifySuccess('Deleted!', 'Item has been deleted successfully.')
    } catch (error) {
      appStore.notifyError('Delete Failed', 'Unable to delete item.')
    }
  }
}
</script>
```

#### 3. Three Button Modal (Save/Cancel/Discard)

```vue
<template>
  <Button @click="handleUnsavedChanges">Exit Form</Button>
</template>

<script setup lang="ts">
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const { saveChanges } = useConfirmModal()
const appStore = useAppStore()
const router = useRouter()

const handleUnsavedChanges = async () => {
  const result = await saveChanges(
    'Unsaved Changes',
    'You have unsaved changes that will be lost if you navigate away.'
  )

  if (result === 'save') {
    try {
      // Save form data
      await saveFormData()
      appStore.notifySuccess('Saved!', 'Changes saved successfully.')
      
      // Navigate away
      router.push('/next-page')
    } catch (error) {
      appStore.notifyError('Save Failed', 'Unable to save changes.')
    }
  } else if (result === 'discard') {
    // Clear form or reset
    resetForm()
    appStore.notifyInfo('Discarded', 'Changes have been discarded.')
    
    // Navigate away
    router.push('/next-page')
  }
  // result === 'cancel' means stay on page
}
</script>
```

#### 4. Loading State Modal

```vue
<template>
  <Button @click="handleProcessData">Process Data</Button>
</template>

<script setup lang="ts">
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'

const { openConfirmModal } = useConfirmModal()
const appStore = useAppStore()

const handleProcessData = async () => {
  // First confirm the action
  const confirmed = await openConfirmModal({
    title: 'Process Data?',
    message: 'This will take approximately 30 seconds to complete.',
    confirmText: 'Start Processing',
    variant: 'confirm'
  })

  if (confirmed === 'confirm') {
    // Show loading modal (no way to cancel once started)
    const processing = openConfirmModal({
      title: 'Processing Data...',
      message: 'Please wait while we process your request.',
      confirmText: 'Processing...',
      cancelText: undefined,
      loading: true,
      variant: 'info'
    })

    try {
      // Simulate long-running process
      await processLargeDataset()
      
      // Success notification
      appStore.notifySuccess('Complete!', 'Data processed successfully.')
    } catch (error) {
      appStore.notifyError('Processing Failed', error.message)
    }
  }
}
</script>
```

#### 5. Custom Content Modal với useModal

```vue
<!-- UserFormModal.vue -->
<template>
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

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 pt-4">
      <Button @click="handleCancel" variant="outline">Cancel</Button>
      <Button @click="handleSave" variant="primary">Create User</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import Button from '@/components/common/Button.vue'

const appStore = useAppStore()

// Emit để đóng modal
const emit = defineEmits<{
  (e: 'close', result?: any): void
}>()

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

const handleSave = async () => {
  if (!validateForm()) {
    appStore.notifyError('Validation Error', 'Please fix the errors and try again.')
    return
  }
  
  try {
    // Save user data
    await createUser(userForm)
    
    // Success and close
    appStore.notifySuccess('User Created!', `User ${userForm.name} has been created successfully.`)
    emit('close', { action: 'save', data: userForm })
  } catch (error) {
    appStore.notifyError('Creation Failed', 'Unable to create user.')
  }
}

const handleCancel = () => {
  emit('close', { action: 'cancel' })
}
</script>

<!-- Parent Component Usage -->
<script setup lang="ts">
import { useModal } from '@/composables/useModal'
import UserFormModal from './UserFormModal.vue'

const { openModal } = useModal()

const showCustomModal = async () => {
  const result = await openModal(UserFormModal, {
    title: 'Create New User',
    description: 'Fill in the user details below'
  })

  if (result?.action === 'save') {
    console.log('User created:', result.data)
  }
}
</script>
```

## 📋 API Reference

### useConfirmModal Composable

```typescript
import { useConfirmModal } from '@/composables/useConfirmModal'

const { 
  confirm, 
  alert, 
  deleteConfirm, 
  warning, 
  saveChanges, 
  openConfirmModal 
} = useConfirmModal()
```

### Helper Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `confirm` | `title: string, message?: string` | `Promise<boolean>` | Standard confirmation dialog |
| `alert` | `title: string, message?: string` | `Promise<void>` | Alert dialog with OK button |
| `deleteConfirm` | `title: string, message?: string` | `Promise<boolean>` | Delete confirmation (danger variant) |
| `warning` | `title: string, message?: string` | `Promise<boolean>` | Warning dialog with continue/cancel |
| `saveChanges` | `title: string, message?: string` | `Promise<'save' \| 'discard' \| 'cancel' \| null>` | Three-button save/discard/cancel |
| `openConfirmModal` | `options: ConfirmModalOptions` | `Promise<'confirm' \| 'cancel' \| 'third' \| null>` | Full customization |

### ConfirmModalOptions Interface

```typescript
interface ConfirmModalOptions {
  variant?: ModalVariant           // Modal type and styling
  size?: ModalSize                 // Modal size
  title?: string                   // Modal title (optional)
  message?: string                 // Modal body message
  showIcon?: boolean               // Show/hide variant icon (default: true)
  confirmText?: string             // Confirm button text (default: 'Confirm')
  cancelText?: string              // Cancel button text (default: 'Cancel')
  thirdText?: string               // Third button text (optional)
  confirmVariant?: ButtonVariant   // Confirm button style (default: 'primary')
  thirdVariant?: ButtonVariant     // Third button style (default: 'secondary')
  loading?: boolean                // Loading state (default: false)
  closeOnBackdrop?: boolean        // Allow backdrop click to close (for docs only)
  autoSize?: boolean               // Auto-size modal based on content (for docs only)
}
```

### Types

```typescript
export type ModalVariant = 'confirm' | 'alert' | 'warning' | 'danger' | 'info' | 'success'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline'
export type ConfirmModalResult = { result: 'confirm' | 'cancel' | 'third' | null }
```

### ConfirmModal Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ModalVariant` | `'confirm'` | Modal type and styling |
| `size` | `ModalSize` | `'md'` | Modal size |
| `title` | `string` | - | Modal title (optional, not displayed in template) |
| `message` | `string` | - | Modal body message |
| `showIcon` | `boolean` | `true` | Show/hide variant icon |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `thirdText` | `string` | - | Third button text |
| `confirmVariant` | `ButtonVariant` | `'primary'` | Confirm button style |
| `thirdVariant` | `ButtonVariant` | `'secondary'` | Third button style |
| `loading` | `boolean` | `false` | Loading state |

### ConfirmModal Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@close` | `ConfirmModalResult` | Modal closed with result |

### ConfirmModal Slots

| Slot | Description |
|------|-------------|
| `default` | Custom content area (appears after message) |

## 🎨 Styling & Variants

### Modal Variants

| Variant | Icon | Background | Color | Use Case |
|---------|------|------------|-------|----------|
| `confirm` | `CheckIcon` | `bg-green-100 dark:bg-green-900/30` | `text-green-600 dark:text-green-400` | General confirmations |
| `alert` | `InfoIcon` | `bg-blue-100 dark:bg-blue-900/30` | `text-blue-600 dark:text-blue-400` | Information alerts |
| `warning` | `WarningIcon` | `bg-yellow-100 dark:bg-yellow-900/30` | `text-yellow-600 dark:text-yellow-400` | Warning messages |
| `danger` | `TrashIcon` | `bg-red-100 dark:bg-red-900/30` | `text-red-600 dark:text-red-400` | Destructive actions |
| `info` | `InfoIcon` | `bg-blue-100 dark:bg-blue-900/30` | `text-blue-600 dark:text-blue-400` | Informational content |
| `success` | `CheckIcon` | `bg-green-100 dark:bg-green-900/30` | `text-green-600 dark:text-green-400` | Success confirmations |

### Modal Sizes

| Size | Min Width | CSS Class | Use Case |
|------|-----------|-----------|----------|
| `sm` | `280px` | `min-w-[280px]` | Simple confirmations |
| `md` | `320px` | `min-w-[320px]` | Standard dialogs (default) |
| `lg` | `480px` | `min-w-[480px]` | Forms and detailed content |
| `xl` | `640px` | `min-w-[640px]` | Complex forms or data |

### Layout Features

- **Horizontal Layout**: Icon và content nằm cạnh nhau
- **Button Order**: Confirm button trước, cancel sau (flex-row-reverse)
- **Icon Styling**: Rounded circle với padding, semantic colors
- **Responsive**: Auto-width với min-width constraints
- **Dark Mode**: Full support với appropriate color variants

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

### 1. Chọn đúng pattern

#### useConfirmModal cho simple confirmations

```typescript
// ✅ Good: Simple yes/no decisions
const confirmed = await confirm('Delete this file?', 'This action cannot be undone.')

// ✅ Good: Pre-defined patterns
const confirmed = await deleteConfirm('Delete User', 'This will remove user access.')
```

#### useModal + ModalWrapper cho complex content

```typescript
// ✅ Good: Forms and complex interactions
const result = await openModal(UserEditModal, { userId: '123' })
```

### 2. Modal Content Guidelines

- **Concise titles**: "Delete User" thay vì "Are you sure you want to delete this user?"
- **Clear messaging**: Giải thích consequences của action
- **Action-focused buttons**: "Delete" thay vì "OK", "Save Changes" thay vì "Submit"

### 3. Error Handling & Loading

```typescript
// ✅ Good: Proper error handling
const handleDelete = async () => {
  const confirmed = await deleteConfirm('Delete Item', 'This action cannot be undone.')
  
  if (confirmed) {
    try {
      await deleteItem(itemId)
      appStore.notifySuccess('Deleted!', 'Item removed successfully.')
    } catch (error) {
      appStore.notifyError('Delete Failed', 'Unable to delete item.')
    }
  }
}
```

### 4. Promise-based Flow

- **Always await** modal results
- **Handle null returns** (user canceled or error)
- **Use async/await** thay vì .then() cho readable code

### 5. UX Guidelines

- **Use modals for important decisions** chỉ
- **Prefer Toast notifications** cho simple feedback
- **Provide clear escape routes** với cancel buttons
- **Match button variants** với action severity (danger for delete)

## 🚨 Common Pitfalls

### ❌ Tránh những lỗi này

#### 1. Modal Stacking

```typescript
// ❌ Bad: Modal trong modal
const handleEdit = async () => {
  const editResult = await openModal(EditModal)
  if (editResult?.unsavedChanges) {
    // DON'T do this - modal in modal
    const saveResult = await confirm('Save changes?')
  }
}

// ✅ Good: Handle trong component hoặc sequence
const handleEdit = async () => {
  const result = await openModal(EditModalWithSaveLogic)
  // Modal handles its own save confirmation internally
}
```

#### 2. Ignoring Promise Results

```typescript
// ❌ Bad: Not handling results
confirm('Delete item?') // No await, no handling

// ✅ Good: Always handle
const confirmed = await confirm('Delete item?')
if (confirmed) {
  // Handle action
}
```

#### 3. Wrong Modal Type cho Use Case

```typescript
// ❌ Bad: Using confirm() for complex forms
const result = await confirm('Edit User', userForm) // Doesn't work

// ✅ Good: Use proper modal system
const result = await openModal(UserEditModal, { user })
```

#### 4. Poor Button Text

```typescript
// ❌ Bad: Generic text
await confirm('Action', 'Do you want to continue?') // "Confirm" button

// ✅ Good: Action-specific text
await openConfirmModal({
  title: 'Publish Article',
  message: 'This will make the article visible to all users.',
  confirmText: 'Publish Now',
  cancelText: 'Keep Draft'
})
```

### ✅ Best Approaches

#### 1. Single Modal Policy

Global modal state ensures one modal tại một thời điểm - no stacking issues.

#### 2. Consistent Error Handling

```typescript
const handleAsyncAction = async () => {
  const confirmed = await confirm('Proceed?')
  if (!confirmed) return
  
  try {
    await performAction()
    appStore.notifySuccess('Success!')
  } catch (error) {
    appStore.notifyError('Failed', error.message)
  }
}
```

#### 3. Type-Safe API

UseConfirmModal provides typed returns - no guessing what user clicked.

#### 4. Progressive Enhancement

Start với simple confirm(), upgrade đến openConfirmModal() khi cần more control.

## 📱 Responsive Behavior

Modal system tự động adapt cho mobile devices:

- **Auto-width** với min-width constraints
- **Proper spacing** với responsive padding
- **Touch-friendly** button sizes
- **Readable text** với appropriate font sizes  
- **Vue-final-modal** provides mobile optimization cho ModalWrapper
- **Backdrop và ESC support** trên desktop

## 🔗 Related Components

- **[Toast Notifications](./toast-notification-system.md)** - Cho simple feedback messages
- **Button Component** - Cho trigger actions
- **Form Components** - Cho custom modal content

## 🎯 Demo & Examples

Xem full interactive demo tại: **[Demo/Modal/ModalDemo.vue](../views/Demo/Modal/ModalDemo.vue)**

Demo bao gồm:

- ✅ Tất cả useConfirmModal helpers
- ✅ Loading states examples  
- ✅ Custom content modal với useModal
- ✅ Error handling patterns
- ✅ Best practice implementations

### Quick Start Examples

```typescript
// 1. Simple confirmation
const { confirm } = useConfirmModal()
const confirmed = await confirm('Delete file?', 'This cannot be undone.')

// 2. Delete confirmation  
const { deleteConfirm } = useConfirmModal()
const confirmed = await deleteConfirm('Delete user?', 'All data will be lost.')

// 3. Three-button modal
const { saveChanges } = useConfirmModal()
const result = await saveChanges('Unsaved changes?', 'Save before leaving?')

// 4. Custom modal
const { openModal } = useModal()
const result = await openModal(CustomFormModal, { title: 'Edit User' })
```

---

**💡 Pro tip:** Modal system integrates seamlessly với Toast notifications - sử dụng Modal cho confirmations, Toast cho results feedback!
