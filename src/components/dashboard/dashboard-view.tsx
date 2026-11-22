"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type SafeUser } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  GraduationCap,
  LogOut,
  User,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

interface DashboardViewProps {
  serverUser: SafeUser;
}

export function DashboardView({ serverUser }: DashboardViewProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Read safe user and status from Zustand store
  const zustandUser = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const clearUser = useAuthStore((state) => state.clearUser);

  // Active display user (Zustand synced, with serverUser fallback)
  const activeUser = zustandUser || serverUser;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
      clearUser();
      router.push("/login");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                EduCore
              </span>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Sprint 14 Skeleton
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-gray-500 dark:text-gray-400">
              Signed in as <strong className="text-gray-800 dark:text-gray-200">{activeUser.email}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              isLoading={isSigningOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome, {activeUser.name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You have successfully authenticated via Supabase SSR and hydrated into the EduCore client store.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Session Active
              </span>
            </div>
          </div>
        </div>

        {/* Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity Verification Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Verified Identity (Server &amp; Client Sync)
              </CardTitle>
              <CardDescription>
                Serialized display model mirrored in Zustand for QA verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100" data-testid="user-name">
                  {activeUser.name}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-mono text-xs text-gray-900 dark:text-gray-100" data-testid="user-email">
                  {activeUser.email}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> User ID (UID)
                </span>
                <span className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all" data-testid="user-uid">
                  {activeUser.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Zustand Store Status
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {authStatus}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Architecture & Security Scope Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Sprint 14 Architecture Checklist
              </CardTitle>
              <CardDescription>
                Verified walking skeleton components in this deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Layered Route Protection:</strong> Next.js 16 Proxy (`proxy.ts`) early session refresh + Server Component identity verification (`auth.getClaims()` / `auth.getUser()`).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Cookie-Backed SSR:</strong> Supabase session persisted via HTTP cookies handled by `@supabase/ssr`.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Zustand Safe Hydration:</strong> Only safe display attributes (`id`, `name`, `email`) mirrored in-memory; zero tokens stored in Zustand or localStorage.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>No Premature Scope:</strong> Catalog, player, instructor studio, payments, and AI features deferred to future sprints as planned.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
