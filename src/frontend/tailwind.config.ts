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
      },
    },
  },
  plugins: [daisyui],
};
export default config;
