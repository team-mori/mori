import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { buildICS } from "@/lib/ics";
import { MOCK_NOTICES } from "@/lib/mock/notices";
import type { Notice } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  let notice: Notice | undefined;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const sb = supabaseServer();
      const { data } = await sb.from("notices").select("*").eq("id", id).maybeSingle();
      if (data) notice = data as Notice;
    } catch {}
  }
  if (!notice) notice = MOCK_NOTICES.find((n) => n.id === id);
  if (!notice) return new NextResponse("Not found", { status: 404 });

  const ics = buildICS(notice);
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mori-${id}.ics"`,
    },
  });
}
