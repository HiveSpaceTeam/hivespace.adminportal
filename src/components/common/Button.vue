<template>
  <button :class="[
    'inline-flex items-center justify-center font-medium gap-2 rounded-lg transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant],
    className,
    {
      'cursor-not-allowed opacity-50': disabled || loading,
      'pointer-events-none': loading
    },
  ]" @click="onClick" :disabled="disabled || loading">

    <!-- Loading Spinner -->
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>

    <span v-if="startIcon && !loading" class="flex items-center">
      <component :is="startIcon" />
    </span>

    <slot></slot>

    <span v-if="endIcon && !loading" class="flex items-center">
      <component :is="endIcon" />
    </span>
  </button>
</template>

<script setup lang="ts">

interface ButtonProps {
  size?: 'sm' | 'md'
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline'
  startIcon?: object
  endIcon?: object
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  variant: 'primary',
  className: '',
  disabled: false,
  loading: false,
})

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
}

const variantClasses = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800',
  secondary:
    'bg-gray-600 text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:disabled:bg-gray-700',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-800',
  warning:
    'bg-yellow-600 text-white shadow-sm hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-800',
  success:
    'bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-green-800',
  outline:
    'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:text-gray-500',
}

const onClick = () => {
  if (!props.disabled && !props.loading && props.onClick) {
    props.onClick()
  }
}
</script>
