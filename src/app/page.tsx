import { redirect } from "next/navigation";
import { getVerifiedUser } from "@/lib/auth/server-auth";

export const dynamic = "force-dynamic";

/**
 * Root canonical landing route.
 * Evaluates cookie-backed auth state at request time and redirects accordingly.
 */
export default async function RootPage() {
  const user = await getVerifiedUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
