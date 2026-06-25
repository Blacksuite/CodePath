/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0a0b14', 900: '#0f1120', 850: '#151830', 800: '#1b1f3a', 700: '#272c4d' },
        brand: { 400: '#8b8cf0', 500: '#6d6cf0', 600: '#5a57e6' },
        mint: { 400: '#34d8a8', 500: '#16c79a' },
        gold: { 400: '#ffd166', 500: '#f4b740' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(109,108,240,0.25), 0 8px 30px -8px rgba(109,108,240,0.45)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
