/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Design tokens ────────────────────────────────────────────────
        // Declared as `rgb(var(--x-rgb) / <alpha-value>)` so that Tailwind can
        // generate opacity modifiers (`bg-surface/95`, `text-paper/70`, …).
        // A raw `var(--x)` value silently emits NO CSS for those variants.
        // The `--x-rgb` triplets live in app/globals.css (both :root and
        // .theme-night) and are kept in sync by `npm run verify:tokens`.
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2-rgb) / <alpha-value>)",
        "ink-3": "rgb(var(--ink-3-rgb) / <alpha-value>)",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
        "line-2": "rgb(var(--line-2-rgb) / <alpha-value>)",
        setu: "rgb(var(--green-rgb) / <alpha-value>)",
        sahyog: "rgb(var(--green-rgb) / <alpha-value>)",
        saffron: "rgb(var(--saffron-rgb) / <alpha-value>)",
        "saffron-hi": "rgb(var(--saffron-hi-rgb) / <alpha-value>)",
        "saffron-tint": "rgb(var(--saffron-tint-rgb) / <alpha-value>)",
        "saffron-2": "rgb(var(--saffron-2-rgb) / <alpha-value>)",
        green: { DEFAULT: "rgb(var(--green-rgb) / <alpha-value>)" },
        "green-2": "rgb(var(--green-2-rgb) / <alpha-value>)",
        "green-tint": "rgb(var(--green-tint-rgb) / <alpha-value>)",
        "green-soft": "rgb(var(--green-soft-rgb) / <alpha-value>)",
        amber: { DEFAULT: "rgb(var(--amber-rgb) / <alpha-value>)" },
        "amber-tint": "rgb(var(--amber-tint-rgb) / <alpha-value>)",
        "amber-soft": "rgb(var(--amber-soft-rgb) / <alpha-value>)",
        // NOTE: blue / purple / red use { DEFAULT } so Tailwind's deep-merge
        // PRESERVES the stock numeric scales (red-500, blue-400, …) already in use.
        blue: { DEFAULT: "rgb(var(--blue-rgb) / <alpha-value>)" },
        "blue-tint": "rgb(var(--blue-tint-rgb) / <alpha-value>)",
        "blue-soft": "rgb(var(--blue-soft-rgb) / <alpha-value>)",
        purple: { DEFAULT: "rgb(var(--purple-rgb) / <alpha-value>)" },
        "purple-tint": "rgb(var(--purple-tint-rgb) / <alpha-value>)",
        red: { DEFAULT: "rgb(var(--red-rgb) / <alpha-value>)" },
        "red-tint": "rgb(var(--red-tint-rgb) / <alpha-value>)",
        violet: "rgb(var(--violet-rgb) / <alpha-value>)",
        "violet-tint": "rgb(var(--violet-tint-rgb) / <alpha-value>)",
        "info-tint": "rgb(var(--info-tint-rgb) / <alpha-value>)",
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
