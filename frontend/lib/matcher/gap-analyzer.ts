// Gap 분석 + 학교 차원 인사이트 생성.
// 부서 어드민의 "Top 3 미달 사유" 같은 집계에 사용.

import type { GapItem, MatchResult } from "../types";

export type GapAggregation = {
  type: string;
  count: number;
  examples: string[];
};

/** 매칭 결과 다수에서 Top N 미달 사유 집계 — 부서 어드민용. */
export function topGapReasons(results: MatchResult[], topN = 3): GapAggregation[] {
  const buckets = new Map<string, { count: number; examples: Set<string> }>();
  for (const r of results) {
    for (const g of r.missing) {
      const key = g.requirement.type;
      const b = buckets.get(key) ?? { count: 0, examples: new Set() };
      b.count += 1;
      if (b.examples.size < 3 && g.gap) b.examples.add(g.gap);
      buckets.set(key, b);
    }
  }
  return [...buckets.entries()]
    .map(([type, b]) => ({ type, count: b.count, examples: [...b.examples] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/** 학생 1명 기준 — Gap 우선순위 (가장 채우기 쉬운 것부터). */
export function rankGapsForStudent(items: GapItem[]): GapItem[] {
  const order: Record<string, number> = {
    year: 0, // 시간만 지나면 됨
    grade: 1, // 학점 추가 이수
    gpa: 2, // 학기 단위 변화
    language: 3, // 시험 응시
    certificate: 4, // 시험 응시
    income_bracket: 5, // 가구 사정
    major: 6, // 변경 어려움
    custom: 99,
  };
  return [...items].sort(
    (a, b) => (order[a.requirement.type] ?? 99) - (order[b.requirement.type] ?? 99),
  );
}
