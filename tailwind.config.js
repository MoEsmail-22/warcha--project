/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ===== Brand (PLAN.md Phase 1) =====
        primary: {
          DEFAULT: '#0D4D47', // primary teal
          light: '#A8D8D8',   // light teal
          50:  '#F0F9F8',
          100: '#DAEFEE',
          200: '#B5DFDE',
          300: '#A8D8D8',
          400: '#5FA8A3',
          500: '#2D7B74',
          600: '#0D4D47',
          700: '#0A3E39',
          800: '#082F2B',
          900: '#05201D',
        },
        accent: {
          DEFAULT: '#FFA500', // orange
          light: '#FFC04D',
          dark:  '#E59400',
        },
        // ===== Status colors (PLAN.md Phase 1) =====
        status: {
          pending:     '#F59E0B', // amber
          confirmed:   '#3B82F6', // blue
          in_progress: '#6366F1', // indigo
          cancelled:   '#EF4444', // red
          completed:   '#10B981', // green
          delayed:     '#DC2626', // dark red
          urgent:      '#B91C1C', // deeper red
          // extra statuses used by Quotes
          draft:    '#9CA3AF',
          sent:     '#3B82F6',
          accepted: '#10B981',
          rejected: '#EF4444',
          expired:  '#6B7280',
        },
        // ===== Neutrals (PLAN.md Phase 1) =====
        // Tailwind's default gray scale is fine; surface tokens added for convenience
        surface: {
          page:    '#F9FAFB', // gray-50
          card:    '#FFFFFF',
          muted:   '#F3F4F6', // gray-100
          border:  '#E5E7EB', // gray-200
        },
      },
      fontFamily: {
        // PLAN.md: Inter (Latin) + Cairo/Tajawal (Arabic)
        sans:    ['Inter', 'Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        latin:   ['Inter', 'system-ui', 'sans-serif'],
        arabic:  ['Cairo', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)',
        sidebar:    '4px 0 12px -4px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
      },
      // Recharts tooltip / axis styling helpers
      keyframes: {
        'fade-in':  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-in': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}