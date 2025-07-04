import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2d1f1a',          // Dark brown
        secondary: '#fbe8df',        // Light beige
        accent: '#ff9248',           // Orange
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
