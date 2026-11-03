/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // amostradas do logo
        choco: { DEFAULT: '#624B36', 950: '#2A1F15', 900: '#3A2B1E', 800: '#4A3828', 700: '#624B36', 600: '#7A5F47' },
        camel: { DEFAULT: '#BEA385', 300: '#D9C6AF', 400: '#C9B094', 500: '#BEA385', 600: '#9A7656', 700: '#7C5D41' },
        ivory: '#FBF8F3',
        cream: '#F4EDE3',
        sand: '#E9DDCC',
        // segundo acento: oliva/sálvia
        olive: { DEFAULT: '#56613F', 100: '#E7EADD', 200: '#CFD5BC', 300: '#AEB892', 600: '#56613F', 700: '#454E32' },
        ink: '#2F241A',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(58,43,30,.06), 0 8px 24px -12px rgba(58,43,30,.18)',
        lift: '0 2px 4px rgba(58,43,30,.06), 0 18px 40px -18px rgba(58,43,30,.28)',
      },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
}
