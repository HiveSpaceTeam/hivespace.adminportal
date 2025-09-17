<template>
  <div class="w-full max-w-[700px] overflow-y-auto">

    <form class="space-y-4" @submit.prevent="onCreate">
      <!-- Full Name Field (Input component) -->
      <div>
        <Input id="adminFullName" v-model="form.fullName" type="text" :label="t('admins.fullName')"
          :placeholder="t('admins.fullNamePlaceholder')" required @blur="validateFullName"
          :inputClass="errors.fullName ? 'border-red-500' : ''" />
        <p v-if="errors.fullName" class="form-error-text">{{ errors.fullName }}</p>
      </div>
      <!-- Email Field (Input component) -->
      <div>
        <Input id="adminEmail" v-model="form.email" type="email" :label="t('admins.email')"
          :placeholder="t('admins.emailPlaceholder')" required @blur="validateEmail" autocomplete="false"
          :inputClass="errors.email ? 'border-red-500' : ''" />
        <p v-if="errors.email" class="form-error-text">{{ errors.email }}</p>
      </div>

      <!-- Password Field (Input component + append slot for toggle) -->
      <div>
        <Input id="adminPassword" v-model="form.password" :type="showPassword ? 'text' : 'password'"
          :label="t('admins.password')" :placeholder="t('admins.passwordPlaceholder')"
          :inputClass="['pr-10', errors.password ? 'border-red-500' : ''].join(' ')" required
          autocomplete="new-password" @update:modelValue="validatePassword" @blur="validatePassword">
        <template #append>
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ShowPasswordIcon v-if="showPassword" />
            <HidePasswordIcon v-else />
          </button>
        </template>
        </Input>
        <div v-if="form.password" class="mt-1">
          <div class="flex items-center space-x-1">
            <div class="flex-1 h-2 bg-gray-200 rounded-full">
              <div :class="['h-2 rounded-full transition-all', passwordStrengthColor]"
                :style="`width: ${passwordStrength}%`">
              </div>
            </div>
            <span :class="['text-xs', passwordStrengthTextColor]">{{ passwordStrengthText }}</span>
          </div>
        </div>
        <p v-if="errors.password" class="form-error-text">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password Field (Input component) -->
      <div>
        <Input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
          :label="t('admins.confirmPassword')" :placeholder="t('admins.confirmPasswordPlaceholder')" required
          @blur="validateConfirmPassword"
          :inputClass="['pr-10', errors.confirmPassword ? 'border-red-500' : ''].join(' ')">
        <template #append>
          <button type="button" @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ShowPasswordIcon v-if="showConfirmPassword" />
            <HidePasswordIcon v-else />
          </button>
        </template>
        </Input>
        <p v-if="errors.confirmPassword" class="form-error-text">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Admin Type Field (only for System Admins) -->
      <div v-if="currentUserIsSystemAdmin">
        <Checkbox v-model="form.isSystemAdmin" :label="t('admins.systemAdmin')" id="is-system-admin" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <Button variant="outline" type="button" :onClick="() => emit('close')">
          {{ t('common.cancel') }}
        </Button>
        <Button variant="primary" type="submit" :disabled="!isFormValid">
          {{ t('admins.createAdmin') }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import { ShowPasswordIcon, HidePasswordIcon } from '@/icons'
import { adminService } from '@/services/admin.service'
import type { CreateAdminRequest, ErrorResponse } from '@/types'
import { useAppStore } from '@/stores/app'


const { t } = useI18n()
const appStore = useAppStore()

defineProps<{
  currentUserIsSystemAdmin: boolean,
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  isSystemAdmin: false,
})

const errors = reactive({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  let score = 0
  if (password.length >= 12) score += 25
  if (password.length >= 16) score += 10
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 20
  return Math.min(score, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return t('admins.passwordWeak')
  if (strength < 60) return t('admins.passwordFair')
  if (strength < 80) return t('admins.passwordGood')
  return t('admins.passwordStrong')
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'bg-red-500'
  if (strength < 60) return 'bg-yellow-500'
  if (strength < 80) return 'bg-blue-500'
  return 'bg-green-500'
})

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'text-red-600'
  if (strength < 60) return 'text-yellow-600'
  if (strength < 80) return 'text-blue-600'
  return 'text-green-600'
})

const isFormValid = computed(() => {
  return !!form.fullName && !!form.email && !!form.password && !!form.confirmPassword &&
    !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword &&
    form.password === form.confirmPassword && passwordStrength.value >= 60
})

function validateEmail() {
  const email = form.email
  if (!email) {
    errors.email = t('admins.emailRequired') as string
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.email = t('admins.emailInvalid') as string
    return false
  }
  errors.email = ''
  return true
}

function validateFullName() {
  const name = form.fullName?.trim()
  if (!name) {
    errors.fullName = t('admins.fullNameRequired') as string
    return false
  }
  errors.fullName = ''
  return true
}

function validatePassword() {
  const password = form.password
  if (!password) {
    errors.password = t('admins.passwordRequired') as string
    return false
  }
  if (password.length < 12) {
    errors.password = t('admins.passwordTooShort') as string
    return false
  }
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    errors.password = t('admins.passwordComplexity') as string
    return false
  }
  errors.password = ''
  return true
}

function validateConfirmPassword() {
  const confirm = form.confirmPassword
  if (!confirm) {
    errors.confirmPassword = t('admins.confirmPasswordRequired') as string
    return false
  }
  if (confirm !== form.password) {
    errors.confirmPassword = t('admins.passwordMismatch') as string
    return false
  }
  errors.confirmPassword = ''
  return true
}

const onCreate = async () => {
  const ok = validateFullName() && validateEmail() && validatePassword() && validateConfirmPassword()
  if (!ok) return

  const adminData: CreateAdminRequest = {
    fullName: form.fullName.trim(),
    email: form.email.toLowerCase().trim(),
    password: form.password,
    confirmPassword: form.confirmPassword,
    isSystemAdmin: form.isSystemAdmin
  }

  try {
    // Show loading state
    appStore.setLoading(true)

    // Call the API
    const createdAdmin = await adminService.createAdmin(adminData)

    // Show success notification
    appStore.notifySuccess(
      t('admins.alerts.success.title'),
      t('admins.alerts.success.message', { email: createdAdmin.email })
    )

    // Emit success result with the created admin data
    emit('close')
  } catch (error: unknown) {

    // Show error notification
    const errorMessage = t('admins.alerts.error.message')
    const errorTitle = t('admins.alerts.error.title')

    // Handle API error response
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: ErrorResponse } }
      const errorData = apiError.response?.data

      // if (errorData?.errors) {
      // // Handle field-specific validation errors
      // const apiErrors = apiError.response.data.errors
      // let hasFieldErrors = false

      // apiErrors.forEach(err => {
      //   const fieldName = err.source.toLowerCase()
      //   if (fieldName === 'fullname') {
      //     errors.fullName = t(`admins.validation.${err.messageCode}`, { defaultValue: err.messageCode })
      //     hasFieldErrors = true
      //   } else if (fieldName === 'email') {
      //     errors.email = t(`admins.validation.${err.messageCode}`, { defaultValue: err.messageCode })
      //     hasFieldErrors = true
      //   } else if (fieldName === 'password') {
      //     errors.password = t(`admins.validation.${err.messageCode}`, { defaultValue: err.messageCode })
      //     hasFieldErrors = true
      //   } else if (fieldName === 'confirmpassword') {
      //     errors.confirmPassword = t(`admins.validation.${err.messageCode}`, { defaultValue: err.messageCode })
      //     hasFieldErrors = true
      //   }
      // })

      // // If we have field errors, don't show the general error notification
      // if (hasFieldErrors) {
      //   return
      // }

      // // Show general error notification if no field-specific errors
      // const firstError = apiErrors[0]
      // appStore.notifyError(
      //   t('admins.notifications.createFailed.title'),
      //   t(`admins.errors.${firstError.messageCode}`, { defaultValue: firstError.messageCode })
      // )
      if (errorData?.status === "409") {
        // Handle conflict (email already exists)
        errors.email = t('admins.emailExists')
      } else {
        // Handle other HTTP errors
        appStore.notifyError(
          errorTitle,
          errorMessage
        )
      }
    } else {
      // Handle network or other errors
      appStore.notifyError(
        errorTitle,
        errorMessage
      )
    }
  } finally {
    // Hide loading state
    appStore.setLoading(false)
  }
}
</script>
