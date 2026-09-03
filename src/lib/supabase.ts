import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://oaxhdrmufkxsegzthzsl.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGhkcm11Zmt4c2VnenRoenNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDg4MzksImV4cCI6MjEwNDAyNDgzOX0.os_09NEwCfDRlUxdKT0mF0RQT_htUoZt5sniNv0uPl4";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGhkcm11Zmt4c2VnenRoenNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQ0ODgzOSwiZXhwIjoyMTA0MDI0ODM5fQ.twHs6gAonf3Yu-_wQXblsP4FuxI9SgmSwbwUBxMCbEA";

/** Public Supabase client for client-side and general operations */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Admin Supabase client with elevated service_role privileges for server-side use */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
