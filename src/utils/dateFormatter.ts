/**
 * Date formatting utilities
 */

/**
 * Format date string to dd/MM/yyyy format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (dd/MM/yyyy)
 */
export function formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) {
        return 'N/A'
    }

    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'N/A'
        }

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    } catch (error) {
        console.error('Error formatting date:', error)
        return 'N/A'
    }
}

/**
 * Format date string to dd/MM/yyyy HH:mm format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (dd/MM/yyyy HH:mm)
 */
export function formatDateTime(dateString: string | Date | null | undefined): string {
    if (!dateString) {
        return 'N/A'
    }

    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'N/A'
        }

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')

        return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch (error) {
        console.error('Error formatting datetime:', error)
        return 'N/A'
    }
}

/**
 * Format date string to relative time (e.g., "2 days ago", "1 hour ago")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date | null | undefined): string {
    if (!dateString) {
        return 'N/A'
    }

    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'N/A'
        }

        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) {
            return 'Vừa xong'
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`
        }

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) {
            return `${diffInHours} giờ trước`
        }

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) {
            return `${diffInDays} ngày trước`
        }

        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) {
            return `${diffInMonths} tháng trước`
        }

        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears} năm trước`
    } catch (error) {
        console.error('Error formatting relative time:', error)
        return 'N/A'
    }
}

/**
 * Check if date string is valid
 * @param dateString - Date string to validate
 * @returns True if valid date
 */
export function isValidDate(dateString: string | null | undefined): boolean {
    if (!dateString) return false

    const date = new Date(dateString)
    return !isNaN(date.getTime())
}

/**
 * Get current date in dd/MM/yyyy format
 * @returns Current date formatted as dd/MM/yyyy
 */
export function getCurrentDateFormatted(): string {
    return formatDate(new Date())
}

/**
 * Get current datetime in dd/MM/yyyy HH:mm format
 * @returns Current datetime formatted as dd/MM/yyyy HH:mm
 */
export function getCurrentDateTimeFormatted(): string {
    return formatDateTime(new Date())
}

