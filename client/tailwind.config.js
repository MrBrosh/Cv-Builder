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
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        surface: {
          800: 'rgba(30, 27, 75, 0.6)',
          900: 'rgba(15, 23, 42, 0.9)',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 24px -4px rgba(139, 92, 246, 0.35)',
        'glow-lg': '0 0 32px -4px rgba(139, 92, 246, 0.4)',
      },
    },
  },
  plugins: [],
}
