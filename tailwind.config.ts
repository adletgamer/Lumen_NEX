import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        teal: "var(--color-teal)",
        indigo: "var(--color-indigo)",
        amber: "var(--color-amber)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
};

export default config;
