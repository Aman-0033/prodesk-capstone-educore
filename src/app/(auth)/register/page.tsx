"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth";
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
import { AlertCircle, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = React.useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    setEmailConfirmationRequired(null);
    const supabase = createClient();

    try {
      const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${siteUrl}/dashboard`,
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Check the two honest Supabase sign-up outcomes:
      // Outcome A: Immediate active session (e.g., email confirmation disabled in Supabase)
      if (authData.session && authData.user) {
        setUser({
          id: authData.user.id,
          name: data.fullName,
          email: authData.user.email || data.email,
        });

        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Outcome B: Email confirmation required (Supabase returned user but no session)
      if (authData.user && !authData.session) {
        setEmailConfirmationRequired(data.email);
      }
    } catch {
      setAuthError("An unexpected error occurred during registration. Please try again.");
    }
  };

  // If email confirmation is required, render dedicated notice
  if (emailConfirmationRequired) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We have sent a verification link to:
          </CardDescription>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {emailConfirmationRequired}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-900 text-xs dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
            <p className="font-semibold mb-1">Email confirmation is enabled in Supabase:</p>
            <p>
              Please open the verification link in your inbox to confirm your account. You will not have access to the dashboard until your email is confirmed.
            </p>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Once confirmed, return to the login page and sign in with your password.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
          >
            Back to Sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle>Create an EduCore account</CardTitle>
        <CardDescription>
          Join as a learner or instructor to get started.
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
            <Label htmlFor="fullName" required>
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              hasError={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              disabled={isSubmitting}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.fullName.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              hasError={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              disabled={isSubmitting}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-xs text-red-600 dark:text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4 text-xs text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="ml-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
