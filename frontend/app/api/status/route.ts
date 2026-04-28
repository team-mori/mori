import { NextResponse } from "next/server";
import { DEMO_USER_ID, supabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ statuses: [] });
  try {
    const sb = supabaseServer();
    const { data } = await sb
      .from("application_status")
      .select("notice_id,status")
      .eq("user_id", DEMO_USER_ID);
    return NextResponse.json({ statuses: data ?? [] });
  } catch {
    return NextResponse.json({ statuses: [] });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const notice_id = (body.notice_id ?? "").toString();
  const status = body.status as "planning" | "completed" | null;
  if (!notice_id) return NextResponse.json({ ok: false }, { status: 400 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ ok: true, source: "mock" });

  try {
    const sb = supabaseServer();
    if (!status) {
      await sb.from("application_status").delete()
        .eq("user_id", DEMO_USER_ID).eq("notice_id", notice_id);
    } else {
      await sb.from("application_status").upsert(
        { user_id: DEMO_USER_ID, notice_id, status, updated_at: new Date().toISOString() },
        { onConflict: "user_id,notice_id" }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
