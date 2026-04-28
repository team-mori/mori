import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email ?? "").toString().trim().toLowerCase();
  const referrer = (body.referrer ?? "").toString().slice(0, 200) || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, source: "mock" });
  }

  try {
    const sb = supabaseServer();
    const { error } = await sb
      .from("prelaunch_signups")
      .insert({ email, referrer })
      .select()
      .single();
    if (error && !error.message.includes("duplicate")) throw error;
    const { count } = await sb
      .from("prelaunch_signups")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ ok: true, count: count ?? 0 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const sb = supabaseServer();
    const { count } = await sb
      .from("prelaunch_signups")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
