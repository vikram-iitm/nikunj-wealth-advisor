/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          950: '#1e1e2f',
          900: '#252538',
          800: '#2d2d44',
          700: '#3d3d5c',
          600: '#4a4a6a',
          500: '#5c5c7a',
        },
        'purple': {
          700: '#5320c0',
          600: '#6225E6',
          500: '#7c3aed',
          400: '#a78bfa',
          300: '#c4b5fd',
          200: '#ddd6fe',
        },
        'gold': {
          600: '#d4a017',
          500: '#FBC638',
          400: '#fcd34d',
          300: '#fde68a',
          200: '#fef3c7',
        },
        'accent': {
          cyan: '#22d3ee',
          emerald: '#34d399',
          rose: '#fb7185',
          blue: '#60a5fa',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'DM Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(124, 58, 237, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(251, 198, 56, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(124, 58, 237, 0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.4)',
        'glow-gold': '0 0 30px rgba(251, 198, 56, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 30px rgba(124, 58, 237, 0.2)',
      },
    },
  },
  plugins: [],
}
