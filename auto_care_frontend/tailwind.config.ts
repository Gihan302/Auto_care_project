import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E201E',
        secondary: '#222725',
        tertiary:'#ECDFCC',
        accent: '#eae3da',

        brand: {
          100: '#fcd9c1',
          500: '#fca36b',
        },
      },
      fontFamily: {
        sans: ['var(--font-khand)', 'sans-serif'],              // Default UI font
        display: ['var(--font-anton)', 'sans-serif'],           // Use for large headings
        serifKannada: ['var(--font-noto-kannada)', 'serif'],    // Kannada or body serif
      },
    },
  },
  plugins: [],
}

export default config
