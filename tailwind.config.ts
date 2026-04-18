import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cyan: {
          primary: '#06B6D4',
        },
        violet: {
          primary: '#8B5CF6',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        glass: '16px',
      },
      borderRadius: {
        glass: '20px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
export default config
