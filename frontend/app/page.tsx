import Link from "next/link";
import SignupForm from "@/components/landing/SignupForm";
import Logo from "@/components/landing/Logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <header className="mx-auto max-w-5xl px-6 pt-6 flex items-center justify-between">
        <Logo className="text-emerald-700 text-lg" />
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/demo/student" className="text-slate-600 hover:text-slate-900">학생용 데모</Link>
          <Link href="/demo/department" className="text-slate-600 hover:text-slate-900">부서용 데모</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-emerald-700">MORI · 모리</p>
        <h1 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
          마감 전에 챙기는<br />
          <span className="text-emerald-600">대학 공지</span>의 새로운 기본값.
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-600 leading-relaxed">
          학생에게는 <b className="text-slate-800">매주 놓치던 장학금 수십만 원</b>을,<br />
          학교 부서에는 <b className="text-slate-800">한 번도 측정된 적 없던</b><br />
          공지 도달 → 신청 전환 데이터를 돌려드립니다.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/demo/student"
            className="w-full sm:w-auto rounded-lg bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            학생용 데모 사용하기
          </Link>
          <Link
            href="/demo/department"
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            학교 부서용 데모 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-center text-lg font-bold text-slate-800">MVP 출시 알림 받기</h2>
          <p className="mt-1 text-center text-sm text-slate-500">
            이메일만 남겨주시면 가장 먼저 알려드릴게요.
          </p>
          <div className="mt-5">
            <SignupForm />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Feature title="📅 캘린더에 자동 추가" desc="공지 카드에서 한 번 누르면 .ics로 다운로드, 모든 캘린더 앱과 호환." />
          <Feature title="🎯 카테고리 자동 분류" desc="장학·비교과·취업으로 즉시 분류. 마감 임박 순으로 정렬." />
          <Feature title="📊 부서엔 운영 데이터" desc="공지 도달률·열람·신청 전환을 익명 집계로 환원." />
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
        <p>모리 — 대학생이 만드는 대학 공지 인프라.</p>
        <p className="mt-1">
          문의:{" "}
          <a href="mailto:hello@mori.app" className="underline">
            hello@mori.app
          </a>
        </p>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
