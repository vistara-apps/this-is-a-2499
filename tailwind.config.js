/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 100% 50%)',
        accent: 'hsl(180 70% 50%)',
        bg: 'hsl(220 20% 98%)',
        surface: 'hsl(255 100% 100%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 1px 2px 0 hsla(0, 0%, 0%, 0.05)',
      },
      animation: {
        'bounce-gentle': 'bounce 1s ease-in-out 3',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}