import { create } from "zustand";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: SafeUser | null;
  status: AuthStatus;
  setUser: (user: SafeUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearUser: () => void;
}

/**
 * In-memory client-side Zustand store for UI identity mirroring.
 *
 * Security rules:
 * - Cookie-backed Supabase session remains the single source of truth.
 * - Stores ONLY non-sensitive display identity (id, name, email) and UI status.
 * - NEVER stores passwords, JWT tokens, refresh tokens, or raw session blobs.
 * - Does not use localStorage for auth tokens.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user: SafeUser) =>
    set({
      user,
      status: "authenticated",
    }),
  setStatus: (status: AuthStatus) =>
    set((state) => ({
      status,
      user: status === "unauthenticated" ? null : state.user,
    })),
  clearUser: () =>
    set({
      user: null,
      status: "unauthenticated",
    }),
}));
