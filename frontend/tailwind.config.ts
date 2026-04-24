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
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        border:  'var(--border)',
        accent:  'var(--accent)',
        accent2: 'var(--accent2)',
        muted:   'var(--muted)',
        danger:  'var(--error)',
        warn:    'var(--warn)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      gridTemplateColumns: {
        'app': '400px 1fr',
      },
    },
  },
  plugins: [],
};

export default config;
