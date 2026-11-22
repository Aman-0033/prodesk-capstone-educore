"use client";

import { useEffect } from "react";
import { useAuthStore, SafeUser } from "@/stores/auth-store";

interface AuthSyncProps {
  initialUser: SafeUser | null;
}

/**
 * Hydrates the client-side Zustand store with the server-verified identity.
 * Prevents hydration mismatches by syncing inside a client effect.
 */
export function AuthSync({ initialUser }: AuthSyncProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      clearUser();
    }
  }, [initialUser, setUser, clearUser]);

  return null;
}
