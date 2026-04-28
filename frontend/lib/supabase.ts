import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anon;

export const supabaseBrowser = () => createClient(url, anon);
export const supabaseServer = () =>
  createClient(url, service, { auth: { persistSession: false } });

// Demo: 단일 가짜 학생 ID. 실제 인증은 추후 추가.
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
