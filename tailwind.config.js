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
          DEFAULT: '#E31E24', // Red Minang
          dark: '#B31419',
          light: '#FF4D4D',
          surface: '#FFF5F5',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Orange Accent
          dark: '#D97706',
          light: '#FBBF24',
          surface: '#FFFBEB',
        },
        accent: '#10B981', // Success Green
        background: '#F9FAFB',
        surface: '#FFFFFF',
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
