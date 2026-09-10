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
          teal: '#76C7C0',
          'teal-light': '#E5F5F3',
          'teal-dark': '#4AA8A0',
          blue: '#9CCFE0',
          'blue-light': '#EDF7FA',
          'blue-dark': '#72B5CC',
          mint: '#D9F3DC',
          'mint-dark': '#8BC996',
          bg: 'rgba(255, 255, 255, 0.45)',
          card: '#FFFFFF',
          border: '#E2EBF0',
          heading: '#334155',
          body: '#64748B',
          muted: '#94A3B8',
          success: '#A7D7B5',
          warning: '#F4D998',
          error: '#F3A6A0',
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
