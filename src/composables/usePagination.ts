import { ref, computed } from 'vue'

export interface PaginationState {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
}

export interface PaginationData {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface UsePaginationOptions {
    initialPageSize?: number
    pageSizeOptions?: number[]
}

export function usePagination(options: UsePaginationOptions = {}) {
    const {
        initialPageSize = 10,
        pageSizeOptions = [10, 20, 50]
    } = options

    // State
    const currentPage = ref(1)
    const pageSize = ref(initialPageSize)
    const totalItems = ref(0)
    const totalPages = ref(0)

    // Computed properties
    const paginationState = computed<PaginationState>(() => ({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        totalItems: totalItems.value,
        totalPages: totalPages.value
    }))

    const hasNextPage = computed(() => currentPage.value < totalPages.value)
    const hasPreviousPage = computed(() => currentPage.value > 1)

    // Methods
    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    const setPageSize = (size: number) => {
        if (pageSizeOptions.includes(size)) {
            pageSize.value = size
            // Reset to page 1 when changing page size
            currentPage.value = 1
        }
    }

    const updatePagination = (data: PaginationData) => {
        currentPage.value = data.currentPage
        pageSize.value = data.pageSize
        totalItems.value = data.totalItems
        totalPages.value = data.totalPages
    }

    const nextPage = () => {
        if (hasNextPage.value) {
            currentPage.value++
        }
    }

    const previousPage = () => {
        if (hasPreviousPage.value) {
            currentPage.value--
        }
    }

    const goToFirstPage = () => {
        currentPage.value = 1
    }

    const goToLastPage = () => {
        currentPage.value = totalPages.value
    }

    const reset = () => {
        currentPage.value = 1
        pageSize.value = initialPageSize
        totalItems.value = 0
        totalPages.value = 0
    }

    // Get API params for requests
    const getApiParams = () => ({
        page: currentPage.value,
        pageSize: pageSize.value
    })

    return {
        // State
        currentPage,
        pageSize,
        totalItems,
        totalPages,

        // Computed
        paginationState,
        hasNextPage,
        hasPreviousPage,

        // Methods
        setPage,
        setPageSize,
        updatePagination,
        nextPage,
        previousPage,
        goToFirstPage,
        goToLastPage,
        reset,
        getApiParams,

        // Options
        pageSizeOptions
    }
}
