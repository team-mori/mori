import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모리 (MORI) — 대학 공지를 액션카드로",
  description: "장학·비교과·취업 공지를 한 곳에서, 마감 전에 챙기세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
