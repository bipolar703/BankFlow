/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-secondary)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        light: 'var(--color-light)',
        dark: 'var(--color-dark)',
        gray: {
          DEFAULT: 'var(--color-gray)',
          // Add standard Tailwind gray palette for compatibility
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      boxShadow: {
        'header': 'var(--shadow-sm)',
        'card': 'var(--shadow-md)',
        'card-hover': 'var(--shadow-lg)',
        'button': '0 4px 8px rgba(0, 54, 48, 0.15)',
        'glass': 'var(--glass-shadow)',
        'glass-hover': '0 12px 36px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        '20': 'var(--border-radius-md)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      ringOpacity: {
        DEFAULT: '0.2',
      },
      ringColor: {
        DEFAULT: 'rgba(19, 78, 74, 0.2)',
      },
    },
  },
  plugins: [],
  // Enhanced safelist with opacity modifiers
  safelist: [
    // Base text colors
    'text-dark',
    'text-light',
    'text-primary',
    'text-secondary', 
    'text-accent',
    'text-gray',
    'text-success',
    'text-warning',
    'text-error',
    // Gray scale variants
    'text-gray-900',
    'text-gray-800',
    'text-gray-700',
    'text-gray-600',
    'text-gray-500',
    'text-gray-400',
    'text-gray-300',
    'text-gray-200',
    'text-gray-100',
    'text-gray-50',
    // Border colors with opacity
    'border-primary',
    'border-primary-light',
    'border-secondary',
    // Gradient colors with opacity
    'from-primary',
    'from-primary/5',
    'from-primary/10',
    'from-primary/20',
    'to-accent',
    'to-accent/10',
    'to-accent/20',
    'to-accent/30',
    // Ring styles
    'ring-1',
    'ring-2',
    'ring-primary',
    'ring-primary-light',
    'ring-opacity-10',
    'ring-opacity-20',
    'ring-opacity-30',
  ],
}
