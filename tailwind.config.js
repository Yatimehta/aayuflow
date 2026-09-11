/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#146356',
          hover: '#0F4A40',
          light: '#E4EFEC',
          'accent-mint': '#CEF3ED',
          'accent-mint-deep': '#9FDCD1',
          critical: '#C23B22',
          criticalLight: '#FBEAE9',
          moderate: '#9C6B14',
          moderateLight: '#FBF1DF',
          success: '#2E7D4F',
          successLight: '#E6F4EA',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(100, 116, 139, 0.08), 0 4px 20px -4px rgba(118, 199, 192, 0.12)',
        'soft-lg': '0 10px 30px -4px rgba(100, 116, 139, 0.1), 0 6px 18px -2px rgba(118, 199, 192, 0.15)',
        'glass': '0 8px 32px 0 rgba(118, 199, 192, 0.15)',
        'glow-teal': '0 0 24px -2px rgba(118, 199, 192, 0.45)',
        'glow-amber': '0 0 24px -2px rgba(245, 158, 11, 0.45)',
        'glow-cyan': '0 0 30px -4px rgba(14, 165, 233, 0.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
