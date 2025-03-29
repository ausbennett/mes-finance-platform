import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/auditLog/page.tsx"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f3f4f6",
        foreground: "#ffffff",
        "primary-text": "#000000",
        "secondary-text": "#6b7280",
        primary: "#800020",
        secondary: "#f3f4f6",
        accent: {
          DEFAULT: '#2D4B73',  // Steel blue
          light: '#4A6B94',
          dark: '#1A304D'
        },
        neutral: {
          DEFAULT: '#4A4A4A',  // Dark gray
          light: '#6B6B6B',
          dark: '#2D2D2D'
        }
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes:[{
      mytheme: {
        "primary": "#800020", 
        // Base colors
        "secondary": "#f3f4f6",   // Used for `btn-secondary`
        "accent": "#2D4B73",      // Used for `btn-accent`
        "neutral": "#4A4A4A",      // Used for `btn-neutral`

        // Button-specific overrides
        "--btn-text-case": "none", // Disable uppercase (optional)
        
        // Primary button
        "--btn-primary": "#800020",
        "--btn-primary-hover": "#600018", // Darker burgundy
        "--btn-primary-active": "#400010",
        "--btn-primary-content": "#ffffff", // White text

        // Secondary button
        "--btn-secondary": "#f3f4f6",
        "--btn-secondary-hover": "#e5e7eb", // Slightly darker gray
        "--btn-secondary-active": "#d1d5db",
        "--btn-secondary-content": "#4A4A4A", // Neutral text

        // Ghost/outline buttons (optional)
        "--btn-ghost-border": "#800020",
        "--btn-ghost-hover": "#8000200d", // 5% opacity

        "--tab-color": "oklch(var(--p))", // Use primary for text
        "--tab-bg": "oklch(var(--b3))", // Background (use your secondary)
        "--tab-border-color": "oklch(var(--p))", // Border matches primary
        "--tab-radius": "0.5rem", // Match your design
      },
    }]
  }
};
export default config;
