"use client";

import { useEffect, useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/subscribe").then((r) => r.json()).then((d) => setCount(d.count ?? 0)).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, referrer: typeof document !== "undefined" ? document.referrer : "" }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setMsg("사전 등록 완료. MVP 출시 시 가장 먼저 알려드립니다.");
      setEmail("");
      if (typeof data.count === "number") setCount(data.count);
    } else {
      setMsg("이메일 형식을 확인해주세요.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요"
          className="flex-1 rounded-lg border border-line-1 bg-paper-0 px-4 py-3 text-base text-ink-800 placeholder:text-fg-4 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-deep px-5 py-3 font-semibold text-white hover:bg-ink-950 disabled:opacity-50 transition-colors"
        >
          {loading ? "등록 중..." : "사전 등록"}
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-eligible-fg">{msg}</p>}
      {count >= 50 && (
        <p className="mt-3 text-sm text-fg-3">현재 {count}명이 기다리고 있어요</p>
      )}
    </div>
  );
}
