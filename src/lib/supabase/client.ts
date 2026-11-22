import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser / Client Components.
 * Reads public credentials from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * (with fallback to NEXT_PUBLIC_SUPABASE_ANON_KEY).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== "undefined") {
      console.warn(
        "Supabase credentials missing: please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local"
      );
    }
  }

  return createBrowserClient(
    supabaseUrl || "https://placeholder-project.supabase.co",
    supabaseKey || "placeholder-anon-key"
  );
}
