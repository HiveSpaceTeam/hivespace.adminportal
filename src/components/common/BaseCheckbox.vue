<template>
  <label :for="idComputed" :class="['flex items-center text-sm font-medium cursor-pointer select-none', labelClass]">
    <div class="relative">
      <input :id="idComputed" type="checkbox" class="sr-only" :disabled="disabled" :checked="modelValue"
        @change="onChange" />
      <div
        :class="[boxBaseClass, modelValue ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700']">
        <span :class="modelValue ? '' : 'opacity-0'">
          <CheckIcon v-if="modelValue" />
        </span>
      </div>
    </div>
    <span class="ml-2">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CheckIcon from '@/icons/CheckIcon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: '' },
})

const emits = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'change', v: boolean): void }>()

const idComputed = computed(() => props.id || `base-checkbox-${Math.random().toString(36).substr(2, 9)}`)
const labelClass = computed(() => (props.disabled ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-400'))
const boxBaseClass = 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500'

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const checked = !!target.checked
  emits('update:modelValue', checked)
  emits('change', checked)
}
</script>

<style scoped>
/* no additional styles; compose with utility classes */
</style>
