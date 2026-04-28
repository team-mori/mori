import type { Config } from "tailwindcss";

// 디자인 시스템 토큰을 Tailwind 클래스로 노출.
// 사용 예: bg-paper, text-fg-1, border-line-1, bg-brand, text-eligible-fg, ...
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        num: ["Inter", "Pretendard", "ui-sans-serif", "sans-serif"],
        display: ["Paperlogy", "Pretendard", "ui-sans-serif", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#0F172A", 900: "#1F2937", 800: "#2B3A55", 700: "#475569",
          600: "#64748B", 500: "#94A3B8", 400: "#CBD5E1", 300: "#E2E8F0",
          200: "#EEF1F5", 100: "#F4F5F7",
        },
        paper: { 0: "#FFFFFF", 50: "#FAFAF7", 100: "#F5F4EE" },
        brand: {
          DEFAULT: "#2B3A55",
          deep: "#1F2937",
          tint: "#E5EAF1",
        },
        eligible: { fg: "#047857", bg: "#ECFDF5" },
        "due-soon": { fg: "#B45309", bg: "#FEF3C7" },
        ineligible: { fg: "#475569", bg: "#E2E8F0" },
        "state-new": { fg: "#2B3A55", bg: "#E5EAF1" },
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        flat: "0 0 0 1px #E2E8F0",
        "lift-1": "0 1px 2px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.04)",
        "lift-2": "0 2px 6px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.05)",
        pop: "0 12px 32px -12px rgba(15,23,42,0.18), 0 0 0 1px rgba(15,23,42,0.06)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
