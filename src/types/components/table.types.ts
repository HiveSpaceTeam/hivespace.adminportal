/**
 * Table Component Types
 * Types for table components, columns, and data management
 */

// Table column configuration
export interface TableColumn<T = unknown> {
    key: keyof T | string
    label: string
    sortable?: boolean
    searchable?: boolean
    width?: string | number
    minWidth?: string | number
    align?: 'left' | 'center' | 'right'
    fixed?: 'left' | 'right'
    render?: (value: unknown, row: T, index: number) => string | HTMLElement
    cellClass?: string | ((value: unknown, row: T) => string)
    headerClass?: string
}

// Table sorting
export interface TableSort {
    column: string
    direction: 'asc' | 'desc'
}

// Table pagination
export interface TablePagination {
    page: number
    pageSize: number
    total: number
    totalPages: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    pageSizeOptions?: number[]
}

// Table filtering
export interface TableFilter {
    column: string
    value: unknown
    operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith'
}

// Table selection
export interface TableSelection<T = unknown> {
    selectedRows: T[]
    selectedRowKeys: (string | number)[]
    isAllSelected: boolean
    isIndeterminate: boolean
}

// Table row actions
export interface TableAction<T = unknown> {
    key: string
    label: string
    icon?: string
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
    disabled?: boolean | ((row: T) => boolean)
    visible?: boolean | ((row: T) => boolean)
    handler: (row: T, index: number) => void
}

// Table configuration
export interface TableConfig<T = unknown> {
    columns: TableColumn<T>[]
    data: T[]
    loading?: boolean
    pagination?: TablePagination
    sorting?: TableSort
    filters?: TableFilter[]
    selection?: TableSelection<T>
    actions?: TableAction<T>[]
    rowKey?: keyof T | string
    bordered?: boolean
    striped?: boolean
    hover?: boolean
    size?: 'sm' | 'md' | 'lg'
    sticky?: boolean
    responsive?: boolean
}

// Table events
export interface TableEvents<T = unknown> {
    onSort?: (sort: TableSort) => void
    onFilter?: (filters: TableFilter[]) => void
    onPageChange?: (pagination: TablePagination) => void
    onSelectionChange?: (selection: TableSelection<T>) => void
    onRowClick?: (row: T, index: number) => void
    onRowDoubleClick?: (row: T, index: number) => void
}