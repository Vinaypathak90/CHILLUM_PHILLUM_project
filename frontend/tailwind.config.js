/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Ye line sabse zaroori hai CSS load hone ke liye
  ],
  theme: {
    extend: {
      // 🚀 Teri custom animations aur keyframes yahan merge kar diye hain
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(36px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.9s ease-out forwards',
      }
    },
  },
  plugins: [],
}