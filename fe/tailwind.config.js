/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e8f4ff',
          200: '#d1e9ff',
          300: '#a6d4ff',
          400: '#7ab8ff',
          500: '#4a9eff',
          600: '#2b7de9',
          700: '#1e5fc7',
          800: '#1648a0',
          900: '#0f3478',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      borderRadius: {
        'sm': '0.25rem',    // 4px - 小圆角
        'DEFAULT': '0.375rem', // 6px - 默认
        'md': '0.5rem',     // 8px - 中等
        'lg': '0.625rem',   // 10px - 大
        'xl': '0.75rem',    // 12px - 超大
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'medium': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'large': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

