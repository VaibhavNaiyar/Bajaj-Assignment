import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        peach:   'var(--peach)',
        taupe:   'var(--taupe)',
        brown:   'var(--brown)',
        dark:    'var(--dark)',
        muted:   'var(--muted)',
        danger:  'var(--error)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)',    'Georgia', 'serif'],
        ui:      ['var(--font-ui)',      'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
