import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            colors: {
                'success': {
                    100: '#d1fae5',
                    300: '#6ee7b7',
                    800: '#065f46',
                    900: '#064e3b',
                },
                'error': {
                    100: '#fee2e2',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                'theme': {
                    'xs': '0.75rem',
                    'sm': '0.875rem',
                }
            }
        },
    },
    plugins: [
        forms,
        typography,
    ],
}
