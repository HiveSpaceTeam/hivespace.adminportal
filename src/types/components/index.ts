/**
 * Component Types Index
 * Central export for all component-related types
 */

// Modal types
export type {
    ModalVariant,
    ModalSize,
    ButtonVariant,
    BaseModalProps,
    ConfirmModalOptions,
    ModalResult,
    AdminModalProps,
    UserModalProps,
    UserModalResult,
} from './modal.types'

// Form types
export type {
    InputType,
    InputSize,
    InputVariant,
    ValidationRule,
    FormField,
    FormState,
    SelectOption,
    SelectField,
    FileUploadField,
    FormSubmissionResult,
} from './form.types'

// Table types
export type {
    TableColumn,
    TableSort,
    TablePagination,
    TableFilter,
    TableSelection,
    TableAction,
    TableConfig,
    TableEvents,
} from './table.types'

// Navigation types
export type {
    MenuItem,
    MenuGroup,
    BreadcrumbItem,
    TabItem,
    SidebarConfig,
} from './navigation.types'

// Admin-specific component types
export type {
    Admin,
    AdminModalClosePayload,
    AdminModalResult,
} from './admin.types'