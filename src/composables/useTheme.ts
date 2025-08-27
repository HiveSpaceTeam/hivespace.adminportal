import { inject } from 'vue'

interface ThemeContext {
    isDarkMode: { value: boolean }
    toggleTheme: () => void
}

export function useTheme(): ThemeContext {
    const theme = inject<ThemeContext>('theme')
    if (!theme) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return theme
}
