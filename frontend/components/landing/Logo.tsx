// Logo — 미드나잇 인디고 + 우상단 그린 닷.
// 출처: Claude Design handoff (mori-design-system/project/assets/wordmark.svg).

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="var(--brand)" />
        <path
          d="M7 14.5 L7 8.5 L10 12 L12 8.5 L14 12 L17 8.5 L17 14.5"
          stroke="var(--paper-50)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="17" cy="6.5" r="1.6" fill="var(--remind-green-600)" />
      </svg>
      <span className="tracking-tight text-ink-800">모리</span>
    </span>
  );
}
