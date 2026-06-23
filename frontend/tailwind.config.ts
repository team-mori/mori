import type { Config } from "tailwindcss";

// 디자인 시스템 토큰을 Tailwind 클래스로 노출.
// 색은 전부 app/design-tokens.css 의 Radix 시맨틱 변수를 참조 (하드코딩 hex 없음).
// 사용 예: bg-page, bg-surface, text-fg-1, border-line-1, bg-brand, text-eligible-fg, ...
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
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
      },
      fontSize: {
        1: ["var(--font-size-1)", { lineHeight: "var(--line-height-1)", letterSpacing: "var(--letter-spacing-1)" }],
        2: ["var(--font-size-2)", { lineHeight: "var(--line-height-2)", letterSpacing: "var(--letter-spacing-2)" }],
        3: ["var(--font-size-3)", { lineHeight: "var(--line-height-3)", letterSpacing: "var(--letter-spacing-3)" }],
        4: ["var(--font-size-4)", { lineHeight: "var(--line-height-4)", letterSpacing: "var(--letter-spacing-4)" }],
        5: ["var(--font-size-5)", { lineHeight: "var(--line-height-5)", letterSpacing: "var(--letter-spacing-5)" }],
        6: ["var(--font-size-6)", { lineHeight: "var(--line-height-6)", letterSpacing: "var(--letter-spacing-6)" }],
        7: ["var(--font-size-7)", { lineHeight: "var(--line-height-7)", letterSpacing: "var(--letter-spacing-7)" }],
        8: ["var(--font-size-8)", { lineHeight: "var(--line-height-8)", letterSpacing: "var(--letter-spacing-8)" }],
        9: ["var(--font-size-9)", { lineHeight: "var(--line-height-9)", letterSpacing: "var(--letter-spacing-9)" }],
      },
      colors: {
        // 표면 (배경 elevation)
        page: "var(--bg-page)",
        surface: "var(--bg-surface)",
        sunken: "var(--bg-sunken)",
        inverse: "var(--bg-inverse)",
        // 텍스트
        fg: {
          1: "var(--fg-1)", 2: "var(--fg-2)", 3: "var(--fg-3)", 4: "var(--fg-4)",
          "on-brand": "var(--on-brand)",
        },
        // 테두리
        line: { 1: "var(--line-1)", 2: "var(--line-2)", strong: "var(--line-strong)" },
        // 브랜드 (ink primary + soft indigo accent)
        brand: {
          DEFAULT: "var(--brand)", deep: "var(--brand-deep)",
          text: "var(--brand-text)", tint: "var(--brand-tint)", line: "var(--brand-line)",
        },
        // 상태 시맨틱 — 자격·마감 (빨강 금지)
        eligible:   { fg: "var(--eligible-fg)",   bg: "var(--eligible-bg)",   line: "var(--eligible-line)" },
        "due-soon": { fg: "var(--due-soon-fg)",   bg: "var(--due-soon-bg)",   line: "var(--due-soon-line)" },
        ineligible: { fg: "var(--ineligible-fg)", bg: "var(--ineligible-bg)", line: "var(--ineligible-line)" },
        "state-new":{ fg: "var(--state-new-fg)",  bg: "var(--state-new-bg)" },
        state: {
          eligible: { fg: "var(--state-eligible-fg)", bg: "var(--state-eligible-bg)", line: "var(--state-eligible-line)" },
          insufficient: { fg: "var(--state-insufficient-fg)", bg: "var(--state-insufficient-bg)", line: "var(--state-insufficient-line)" },
          ineligible: { fg: "var(--state-ineligible-fg)", bg: "var(--state-ineligible-bg)", line: "var(--state-ineligible-line)" },
          unknown: { fg: "var(--state-unknown-fg)", bg: "var(--state-unknown-bg)", line: "var(--state-unknown-line)" },
          due: { fg: "var(--state-due-soon-fg)", bg: "var(--state-due-soon-bg)", line: "var(--state-due-soon-line)" },
          saved: { fg: "var(--state-saved-fg)", bg: "var(--state-saved-bg)", line: "var(--state-saved-line)" },
          planned: { fg: "var(--state-planned-fg)", bg: "var(--state-planned-bg)", line: "var(--state-planned-line)" },
          applied: { fg: "var(--state-applied-fg)", bg: "var(--state-applied-bg)", line: "var(--state-applied-line)" },
          calendar: { fg: "var(--state-calendar-fg)", bg: "var(--state-calendar-bg)", line: "var(--state-calendar-line)" },
        },
        // legacy 별칭 (기존 데모 페이지 호환) — Radix slate 로 매핑
        ink: {
          950: "var(--slate-12)", 900: "var(--slate-12)", 800: "var(--slate-12)", 700: "var(--slate-11)",
          600: "var(--slate-11)", 500: "var(--slate-10)", 400: "var(--slate-9)", 300: "var(--slate-7)",
          200: "var(--slate-6)", 100: "var(--slate-3)",
        },
        paper: { 0: "var(--bg-surface)", 50: "var(--bg-page)", 100: "var(--slate-3)" },
      },
      borderRadius: {
        1: "var(--radius-1)",
        2: "var(--radius-2)",
        3: "var(--radius-3)",
        4: "var(--radius-4)",
        5: "var(--radius-5)",
        6: "var(--radius-6)",
        full: "var(--radius-thumb)",
        pill: "var(--radius-thumb)",
      },
      boxShadow: {
        flat: "var(--shadow-1)",
        "lift-1": "var(--shadow-2)",
        "lift-2": "var(--shadow-3)",
        pop: "var(--shadow-5)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
