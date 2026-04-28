import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { MOCK_NOTICES } from "@/lib/mock/notices";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ notices: MOCK_NOTICES, source: "mock" });
  }
  try {
    const sb = supabaseServer();
    const { data, error } = await sb
      .from("notices")
      .select("*")
      .order("end_date", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ notices: MOCK_NOTICES, source: "mock" });
    }
    return NextResponse.json({ notices: data, source: "supabase" });
  } catch {
    return NextResponse.json({ notices: MOCK_NOTICES, source: "mock" });
  }
}
