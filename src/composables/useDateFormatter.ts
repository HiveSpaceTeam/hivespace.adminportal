import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, formatDateTime, formatRelativeTime } from '@/utils/dateFormatter'

/**
 * Composable for date formatting with i18n support
 */
export function useDateFormatter() {
    const { locale } = useI18n()

    /**
     * Format date with locale-specific formatting
     */
    const formatDateLocalized = (dateString: string | Date | null | undefined) => {
        return formatDate(dateString)
    }

    /**
     * Format datetime with locale-specific formatting
     */
    const formatDateTimeLocalized = (dateString: string | Date | null | undefined) => {
        return formatDateTime(dateString)
    }

    /**
     * Format relative time with locale-specific formatting
     */
    const formatRelativeTimeLocalized = (dateString: string | Date | null | undefined) => {
        return formatRelativeTime(dateString)
    }

    /**
     * Get current date formatted
     */
    const getCurrentDate = computed(() => {
        return formatDate(new Date())
    })

    /**
     * Get current datetime formatted
     */
    const getCurrentDateTime = computed(() => {
        return formatDateTime(new Date())
    })

    return {
        formatDate: formatDateLocalized,
        formatDateTime: formatDateTimeLocalized,
        formatRelativeTime: formatRelativeTimeLocalized,
        getCurrentDate,
        getCurrentDateTime
    }
}

