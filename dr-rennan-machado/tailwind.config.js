/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1E1913', soft: '#3B332A', muted: '#5E5447' },
        gold: { DEFAULT: '#D9AE3F', light: '#ECCF7E', deep: '#7E5C12', dark: '#6A4C0D' },
        cream: { DEFAULT: '#FBF6EC', ivory: '#FFFDF7', sand: '#F2E7D2', line: '#E4D6BB' },
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { label: '0.22em' },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
};
