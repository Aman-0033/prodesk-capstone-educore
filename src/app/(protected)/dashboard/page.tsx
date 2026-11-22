import { Metadata } from "next";
import { requireAuthUser } from "@/lib/auth/server-auth";
import { AuthSync } from "@/components/auth/auth-sync";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — EduCore LMS",
  description: "EduCore authenticated learner & instructor dashboard skeleton",
};

export default async function DashboardPage() {
  // Independent server-side authentication verification.
  // Never trusts client cookies or getSession() alone for authorization decisions.
  const user = await requireAuthUser("/login");

  return (
    <>
      {/* Hydrate safe display identity into Zustand store on the client */}
      <AuthSync initialUser={user} />
      <DashboardView serverUser={user} />
    </>
  );
}
