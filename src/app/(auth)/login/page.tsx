"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [authError, setAuthError] = React.useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const supabase = createClient();

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(
          error.message === "Invalid login credentials"
            ? "Invalid email or password. Please verify your credentials and try again."
            : error.message
        );
        return;
      }

      if (authData.user) {
        const fullName =
          (authData.user.user_metadata?.full_name as string | undefined) ||
          (authData.user.user_metadata?.name as string | undefined) ||
          data.email.split("@")[0] ||
          "User";

        setUser({
          id: authData.user.id,
          name: fullName,
          email: authData.user.email || data.email,
        });

        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setAuthError("An unexpected error occurred during sign in. Please try again.");
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle>Sign in to EduCore</CardTitle>
        <CardDescription>
          Enter your email and password to access your dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email" required>
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="learner@example.com"
              hasError={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>
                Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              hasError={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 text-xs text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="ml-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
        >
          Create account
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading login form...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
