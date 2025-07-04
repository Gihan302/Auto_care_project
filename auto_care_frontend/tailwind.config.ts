import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E201E',          // Dark brown
        secondary: '#222725',        // Light beige
        tertiary: '#ECDFCC',           // Orange
        brand: {
          100: '#fcd9c1',
          500: '#fca36b',
        },
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
