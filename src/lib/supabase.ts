import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://oaxhdrmufkxsegzthzsl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_elZdaDlVeXUVT8Jyog_6jA_8EDBo6H7";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
