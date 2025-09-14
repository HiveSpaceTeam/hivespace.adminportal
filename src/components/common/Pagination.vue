<template>
    <div class="flex items-center justify-between">
        <!-- Results info -->
        <div class="flex-1 flex justify-between sm:hidden">
            <button @click="$emit('pageChange', currentPage - 1)" :disabled="currentPage <= 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ $t('pagination.previous') }}
            </button>
            <button @click="$emit('pageChange', currentPage + 1)" :disabled="currentPage >= totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ $t('pagination.next') }}
            </button>
        </div>

        <!-- Desktop pagination -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ $t('pagination.showing') }}
                    <span class="font-medium">{{ startItem }}</span>
                    {{ $t('pagination.to') }}
                    <span class="font-medium">{{ endItem }}</span>
                    {{ $t('pagination.of') }}
                    <span class="font-medium">{{ totalItems }}</span>
                    {{ $t('pagination.results') }}
                </p>
            </div>

            <div class="flex items-center space-x-2">
                <!-- Page size selector -->
                <div class="flex items-center space-x-2">
                    <label class="text-sm text-gray-700 dark:text-gray-300">{{ $t('pagination.itemsPerPage') }}:</label>
                    <select :value="pageSize" @change="$emit('pageSizeChange', parseInt($event.target.value))"
                        class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option v-for="size in pageSizeOptions" :key="size" :value="size">
                            {{ size }}
                        </option>
                    </select>
                </div>

                <!-- Pagination controls -->
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <!-- Previous button -->
                    <button @click="$emit('pageChange', currentPage - 1)" :disabled="currentPage <= 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                        <span class="sr-only">{{ $t('pagination.previous') }}</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>

                    <!-- Page numbers -->
                    <template v-for="page in visiblePages" :key="page">
                        <button v-if="page === '...'" disabled
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-default dark:bg-gray-800 dark:border-gray-600">
                            ...
                        </button>
                        <button v-else @click="$emit('pageChange', page)" :class="[
                            page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                        ]">
                            {{ page }}
                        </button>
                    </template>

                    <!-- Next button -->
                    <button @click="$emit('pageChange', currentPage + 1)" :disabled="currentPage >= totalPages"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                        <span class="sr-only">{{ $t('pagination.next') }}</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface PaginationProps {
    currentPage: number
    totalItems: number
    pageSize: number
    totalPages: number
    pageSizeOptions?: number[]
}

interface PaginationEmits {
    pageChange: [page: number]
    pageSizeChange: [pageSize: number]
}

const props = withDefaults(defineProps<PaginationProps>(), {
    pageSizeOptions: () => [10, 20, 50]
})

defineEmits<PaginationEmits>()

const { t } = useI18n()

// Calculate display info
const startItem = computed(() => {
    return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
    return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

// Calculate visible page numbers
const visiblePages = computed(() => {
    const delta = 2 // Number of pages to show around current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, props.currentPage - delta); i <= Math.min(props.totalPages - 1, props.currentPage + delta); i++) {
        range.push(i)
    }

    if (props.currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
    } else {
        rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (props.currentPage + delta < props.totalPages - 1) {
        rangeWithDots.push('...', props.totalPages)
    } else if (props.totalPages > 1) {
        rangeWithDots.push(props.totalPages)
    }

    // Remove duplicates and return unique pages
    return [...new Set(rangeWithDots)]
})
</script>
