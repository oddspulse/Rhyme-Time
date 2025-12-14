/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c9ff00',
        secondary: '#ff006e',
        success: '#06ffa5',
        background: '#1a1a2e',
      },
      animation: {
        'beat-pulse': 'beat-pulse 0.3s ease-in-out',
      },
      keyframes: {
        'beat-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
}
