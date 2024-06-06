import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        red: {
          500: '#ef4444',
          700: '#b91c1c',
        },
        green: {
          500: '#10b981',
          700: '#047857',
        },
        blue: {
          500: '#3b82f6',
          700: '#1d4ed8',
        },
        yellow: {
          500: '#f59e0b',
          700: '#b45309',
        },
        purple: {
          500: '#8b5cf6',
          700: '#6d28d9',
        },
        orange: {
          500: '#f97316',
          700: '#c2410c',
        },
      }
    },
  },
  plugins: [],
};
export default config;
