<template>
  <div class="relative" ref="rootRef" :style="{ '--menu-width': menuWidthPx + 'px' }">
    <label v-if="props.label" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{ props.label
    }}</label>
    <DropdownMenu :menuItems="[]" :buttonClass="finalButtonClass" :menuClass="finalMenuClass"
      :itemClass="props.itemClass">
      <template #icon="{ open }">
        <span class="flex items-center justify-between w-full">
          <span class="truncate text-sm text-gray-700 dark:text-gray-300">{{ selectedLabel || placeholder }}</span>
          <ChevronDownIcon :class="['ml-2 text-gray-400 transition-transform', open ? 'rotate-180' : 'rotate-0']" />
        </span>
      </template>

      <template #menu>
        <template v-for="(opt, idx) in options" :key="opt.value ?? idx">
          <button @click="select(opt.value)" :class="['w-full text-left px-3 py-2 text-sm', props.itemClass || '']">
            {{ opt.label }}
          </button>
        </template>
      </template>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'

interface Option {
  value: string | number
  label: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  options?: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  buttonClass?: string
  menuClass?: string
  itemClass?: string
}>(), {
  options: () => [],
  placeholder: 'Select',
  disabled: false,
  buttonClass: 'w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center',
  menuClass: 'absolute right-0 z-40 w-56 p-2 space-y-1 bg-white border border-gray-200 top-full rounded-2xl shadow-lg dark:border-gray-800 dark:bg-gray-dark',
  itemClass: 'flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300',
})

const emit = defineEmits(['update:modelValue', 'change'])

// allow consumers to override buttonClass; fall back to a default that includes a border
const defaultButtonClass = 'w-full text-left px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'
const finalButtonClass = computed(() => props.buttonClass || defaultButtonClass)

// size handling: ensure menu width matches trigger width but keeps a minimum
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
const rootRef = ref<HTMLElement | null>(null)
const menuWidthPx = ref(0)
const MIN_WIDTH_PX = 14 * 16 // 14rem -> 224px

function updateMenuWidth() {
  if (!rootRef.value) return
  const w = Math.round(rootRef.value.getBoundingClientRect().width)
  menuWidthPx.value = Math.max(w || 0, MIN_WIDTH_PX)
}

let ro: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  updateMenuWidth()
  if (rootRef.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateMenuWidth())
    ro.observe(rootRef.value)
  }
})
onBeforeUnmount(() => {
  if (ro && rootRef.value) ro.unobserve(rootRef.value)
})

const options = props.options || []

const selectedLabel = computed(() => {
  const found = options.find(o => o.value === props.modelValue)
  return found ? found.label : ''
})

const placeholder = props.placeholder || 'Select'

const select = (value: string | number) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// final menu class: always include min and width classes so it matches trigger
const SIZE_CLASSES = 'min-w-[14rem] w-[var(--menu-width)] mt-2'
const finalMenuClass = computed(() => `${props.menuClass || ''} ${SIZE_CLASSES}`.trim())
</script>
