import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface SafeAuthUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Server-side identity verification.
 * Uses verified claims (auth.getClaims()) or server-confirmed lookup (auth.getUser()).
 * NEVER trusts unvalidated getSession() or raw cookie content alone for authorization.
 */
export async function getVerifiedUser(): Promise<SafeAuthUser | null> {
  const supabase = await createClient();

  // 1. Try Supabase verified claims API if supported
  try {
    const authAny = supabase.auth as unknown as {
      getClaims?: () => Promise<{
        data: { claims: { sub?: string; email?: string; user_metadata?: { full_name?: string }; full_name?: string } } | null;
        error: Error | null;
      }>;
    };

    if (typeof authAny.getClaims === "function") {
      const { data, error } = await authAny.getClaims();
      if (!error && data?.claims?.sub) {
        const claims = data.claims;
        const sub = claims.sub;
        if (sub) {
          const name =
            claims.user_metadata?.full_name ||
            claims.full_name ||
            (claims.email ? claims.email.split("@")[0] : "User");

          return {
            id: sub,
            name,
            email: claims.email || "",
          };
        }
      }
    }
  } catch {
    // If getClaims fails (e.g., symmetric key or older auth server), fall back to getUser()
  }

  // 2. Server-side verified user lookup via Supabase Auth
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const name =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      (user.email ? user.email.split("@")[0] : "User");

    return {
      id: user.id,
      name,
      email: user.email || "",
    };
  } catch {
    return null;
  }
}

/**
 * Route protection guard for Server Components and layouts.
 * Enforces server-side authentication; redirects unauthenticated visitors to /login.
 */
export async function requireAuthUser(redirectTo = "/login"): Promise<SafeAuthUser> {
  const user = await getVerifiedUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}
