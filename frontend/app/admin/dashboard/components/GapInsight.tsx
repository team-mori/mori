// Gap 인사이트 — 부서가 자격 요건 설계를 개선하는 데 사용.
//
// "신청 의사를 보였지만 자격 미달인 학생"의 Top 3 미달 사유를 보여준다.
// 부서는 이걸 보고 "요건이 너무 빡빡한가?" / "이런 갭은 별도 멘토링으로 채울 수 있나?" 판단.

import type { GapAggregation } from "@/lib/matcher";

const TYPE_LABEL: Record<string, string> = {
  gpa: "GPA",
  year: "학년",
  income_bracket: "소득분위",
  language: "어학",
  certificate: "자격증",
  major: "전공",
  grade: "이수학점",
  custom: "기타 요건",
};

export default function GapInsight({
  totalApplicants,
  unfitApplicants,
  topReasons,
}: {
  totalApplicants: number;
  unfitApplicants: number;
  topReasons: GapAggregation[];
}) {
  const ratio = totalApplicants > 0 ? Math.round((unfitApplicants / totalApplicants) * 100) : 0;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">자격 미달 신청자 비율</h3>
        <span className="text-2xl font-bold text-zinc-900 tabular-nums">{ratio}%</span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        신청 의사 표시 {totalApplicants}명 중 {unfitApplicants}명 자격 미달
      </p>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-zinc-500">Top 3 미달 사유</p>
        {topReasons.length === 0 ? (
          <p className="text-xs text-zinc-400">데이터 부족</p>
        ) : (
          <ul className="space-y-1.5">
            {topReasons.map((r) => (
              <li key={r.type} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{TYPE_LABEL[r.type] ?? r.type}</span>
                <span className="text-xs text-zinc-500 tabular-nums">{r.count}명</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
