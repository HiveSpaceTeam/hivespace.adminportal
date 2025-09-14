/**
 * Navigation Component Types
 * Types for navigation, routing, and menu components
 */

// Menu item types
export interface MenuItem {
    id: string
    label: string
    icon?: string
    route?: string
    href?: string
    target?: '_blank' | '_self'
    disabled?: boolean
    visible?: boolean
    permission?: string
    badge?: string | number
    children?: MenuItem[]
}

export interface MenuGroup {
    id: string
    label: string
    items: MenuItem[]
    collapsed?: boolean
    permission?: string
}

// Breadcrumb types
export interface BreadcrumbItem {
    label: string
    route?: string
    href?: string
    disabled?: boolean
}

// Tab types
export interface TabItem {
    key: string
    label: string
    icon?: string
    disabled?: boolean
    closable?: boolean
    content?: string
}

// Sidebar types
export interface SidebarConfig {
    collapsed: boolean
    width: string
    collapsedWidth: string
    breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
    theme?: 'light' | 'dark'
    position?: 'left' | 'right'
}