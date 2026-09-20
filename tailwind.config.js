/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        setu: "var(--green)",
        sahyog: "var(--green)",
        saffron: "var(--saffron)",
        "saffron-hi": "var(--saffron-hi)",
        "saffron-tint": "var(--saffron-tint)",
        "saffron-2": "var(--saffron-2)",
        green: "var(--green)",
        "green-2": "var(--green-2)",
        "green-tint": "var(--green-tint)",
        "green-soft": "var(--green-soft)",
        amber: "var(--amber)",
        "amber-tint": "var(--amber-tint)",
        "red-tint": "var(--red-tint)",
        violet: "var(--violet)",
        "violet-tint": "var(--violet-tint)",
        "info-tint": "var(--info-tint)",
        // Gov UX4G semantic palette
        primary: {
          50: '#f2efff', 100: '#dcd4ff', 200: '#c0b3ff', 300: '#a391ff',
          400: '#8670ff', 500: '#6a4eff', 600: '#4a2bc2', 700: '#3d239f',
          800: '#301c7d', 900: '#24145c', 950: '#1a0e3d',
          DEFAULT: '#4a2bc2'
        },
        success: { DEFAULT: '#1aa64a', dark: '#006c35' },
        error: { DEFAULT: '#f55e57', dark: '#b3251e' },
        warning: { DEFAULT: '#ffab27', dark: '#d46b08' },
        info: { DEFAULT: '#59d8ce', dark: '#13c2c2' }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
