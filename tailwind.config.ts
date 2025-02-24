import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "#232323",
          "primary-content": "#fff",
        },
      },
    ],
  },
  plugins: [daisyui],
} satisfies Config;
