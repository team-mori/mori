// EligibilityBadge — 자격 충족 / 부족 / 미달 3상태. 절대 빨강 금지.
// 디자인 시스템 매핑:
//   eligible (자격 충족)   = green   + check-circle-2
//   partial  (자격 부족)   = amber   + alert-circle
//   ineligible (자격 미달) = grey    + minus-circle  ← never red

import { AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import type { MatchStatus } from "@/lib/types";

type State = "eligible" | "partial" | "ineligible" | "unknown";

const MAP: Record<State, { fg: string; bg: string; label: string; Icon: typeof CheckCircle2 }> = {
  eligible:   { fg: "text-eligible-fg",   bg: "bg-eligible-bg",   label: "자격 충족", Icon: CheckCircle2 },
  partial:    { fg: "text-due-soon-fg",   bg: "bg-due-soon-bg",   label: "자격 부족", Icon: AlertCircle },
  ineligible: { fg: "text-ineligible-fg", bg: "bg-ineligible-bg", label: "자격 미달", Icon: MinusCircle },
  unknown:    { fg: "text-ink-600",       bg: "bg-ink-100",       label: "정보 입력 필요", Icon: MinusCircle },
};

export function statusToState(s: MatchStatus): State {
  if (s === "fit") return "eligible";
  if (s === "gap") return "partial";
  if (s === "unfit") return "ineligible";
  return "unknown";
}

type Props = {
  state: State;
  /** compact = 메타 라인 안에 인라인으로 들어갈 때 (배경 없음, 작게) */
  compact?: boolean;
};

export default function EligibilityBadge({ state, compact = false }: Props) {
  const { fg, bg, label, Icon } = MAP[state];
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[13px] font-semibold leading-none ${fg}`}>
        <Icon size={13} strokeWidth={2} aria-hidden />
        {label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold leading-none ${fg} ${bg}`}>
      <Icon size={13} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}
