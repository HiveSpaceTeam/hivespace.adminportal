/**
 * Types Index
 * Central export point for all application types
 * 
 * Usage examples:
 * import type { CreateAdminRequest, AdminModalResult } from '@/types'
 * import type { UserData, TableColumn } from '@/types'
 */

// API types - All backend interface contracts
export type {
    // Admin API
    CreateAdminRequest,
    CreateAdminResponse,
    UpdateAdminRequest,
    DashboardStats,
    SystemHealth,
    SystemLog,
    Permission,
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
    AuditLog,
    AuditLogParams,
    SystemSettings,

    // User API
    UserData,
    UserListResponse,
    UserListParams,
    CreateUserRequest,
    UpdateUserRequest,
    UserPreferences,

    // Auth API
    LoginCredentials,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,

    // Common API
    ApiResponse,
    PaginatedResponse,
    ApiError,
    ErrorResponse,
    PaginationParams,
    SortParams,
    SearchParams,
    FilterParams,
    FileUploadResponse,
    UploadProgress,
} from './api'

// Component types - UI component interfaces
export type {
    // Modal components
    ModalVariant,
    ModalSize,
    ButtonVariant,
    BaseModalProps,
    ConfirmModalOptions,
    ModalResult,
    AdminModalProps,
    UserModalProps,
    UserModalResult,

    // Admin components
    Admin,
    AdminModalClosePayload,
    AdminModalResult,

    // Form components
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

    // Table components
    TableColumn,
    TableSort,
    TablePagination,
    TableFilter,
    TableSelection,
    TableAction,
    TableConfig,
    TableEvents,

    // Navigation components
    MenuItem,
    MenuGroup,
    BreadcrumbItem,
    TabItem,
    SidebarConfig,
} from './components'

// Store types - State management interfaces
export type {
    NotificationOptions,
    Notification,
    AppState,
    UserStoreState,
    AuthState,
    StoreAction,
    StoreGetters,
    StoreError,
} from './store'

// Utility types - Helper and common types
export type {
    Nullable,
    Optional,
    Maybe,
    EventHandler,
    AsyncHandler,
    Callback,
    PromiseType,
    UnwrapPromise,
    ArrayElement,
    NonEmptyArray,
    StringLiteral,
    EmptyString,
    Status,
    LoadingState,
    ID,
    UUID,
    DateString,
    Timestamp,
    ApiMethod,
    HttpStatusCode,
    Permission as PermissionString,
    Role as RoleString,
    Theme,
    ColorScheme,
    Breakpoint,
    Size,
    ComponentSize,
    DeepReadonly,
    KeyValuePair,
    Environment,
    Locale,
} from './utils'

// App-specific types
export type { AppUser } from './app-user'