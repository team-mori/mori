export type DeptKey = "scholarship" | "extracurricular" | "career";

export const DEPT_OPTIONS: { key: DeptKey; label: string }[] = [
  { key: "scholarship", label: "장학복지팀" },
  { key: "extracurricular", label: "비교과센터" },
  { key: "career", label: "경력개발지원단" },
];

export type DeptData = {
  reachRate: number; // %
  totalSubscribers: number;
  reachedStudents: number;
  topClicks: { title: string; clicks: number }[];
  calendarSync7d: { date: string; rate: number }[];
  funnel: {
    title: string;
    reach: number;
    open: number;
    calendar: number;
    planning: number;
    completed: number;
  }[];
};

const days = (n: number) => {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return arr;
};

export const DEPT_MOCK: Record<DeptKey, DeptData> = {
  scholarship: {
    reachRate: 73,
    totalSubscribers: 1240,
    reachedStudents: 905,
    topClicks: [
      { title: "2025-1 국가장학금 2차 신청 안내", clicks: 412 },
      { title: "성적우수 교내장학 신청", clicks: 298 },
      { title: "근로장학 봄학기 모집", clicks: 254 },
      { title: "저소득층 생활지원금", clicks: 188 },
      { title: "기숙사 장학 추천 안내", clicks: 142 },
    ],
    calendarSync7d: days(7).map((date, i) => ({ date, rate: 18 + i * 3 + (i % 2) * 4 })),
    funnel: [
      { title: "국가장학금 2차", reach: 100, open: 78, calendar: 55, planning: 41, completed: 28 },
      { title: "성적우수 교내장학", reach: 100, open: 71, calendar: 49, planning: 34, completed: 22 },
      { title: "근로장학 봄학기", reach: 100, open: 64, calendar: 38, planning: 27, completed: 18 },
    ],
  },
  extracurricular: {
    reachRate: 68,
    totalSubscribers: 1240,
    reachedStudents: 843,
    topClicks: [
      { title: "글로벌 챌린지 프로그램", clicks: 356 },
      { title: "창업캠프 봄 모집", clicks: 287 },
      { title: "리더십 워크숍", clicks: 211 },
      { title: "멘토링 매칭", clicks: 174 },
      { title: "독서토론 동아리", clicks: 96 },
    ],
    calendarSync7d: days(7).map((date, i) => ({ date, rate: 14 + i * 2 + (i % 3) * 3 })),
    funnel: [
      { title: "글로벌 챌린지", reach: 100, open: 72, calendar: 47, planning: 33, completed: 19 },
      { title: "창업캠프 봄", reach: 100, open: 66, calendar: 41, planning: 28, completed: 15 },
      { title: "리더십 워크숍", reach: 100, open: 58, calendar: 32, planning: 21, completed: 12 },
    ],
  },
  career: {
    reachRate: 81,
    totalSubscribers: 1240,
    reachedStudents: 1004,
    topClicks: [
      { title: "삼성전자 채용설명회", clicks: 521 },
      { title: "공기업 NCS 특강", clicks: 388 },
      { title: "이력서 첨삭 클리닉", clicks: 274 },
      { title: "현직자 멘토링", clicks: 198 },
      { title: "AI직무 부트캠프", clicks: 152 },
    ],
    calendarSync7d: days(7).map((date, i) => ({ date, rate: 22 + i * 4 + (i % 2) * 3 })),
    funnel: [
      { title: "삼성전자 채용설명회", reach: 100, open: 84, calendar: 62, planning: 48, completed: 31 },
      { title: "공기업 NCS 특강", reach: 100, open: 76, calendar: 51, planning: 36, completed: 24 },
      { title: "이력서 첨삭 클리닉", reach: 100, open: 69, calendar: 43, planning: 30, completed: 19 },
    ],
  },
};
