# EduCore — Sprint 14 Authentication & Protected Routing Walking Skeleton

> **Engineering Track:** Advanced Frontend Specialist
> **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
> **Authentication BaaS:** Supabase Auth (`@supabase/ssr` + `@supabase/supabase-js`)
> **State Management:** Zustand (in-memory UI identity mirror)
> **Forms & Validation:** React Hook Form + Zod
> **Deployment Target:** Vercel

---

## 1. Architectural Overview & Security Boundaries

Sprint 14 establishes the core authentication and routing skeleton for EduCore. Security is enforced through a **layered defense model** rather than relying on a single gate:

```
[ Incoming HTTP Request ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 1: Next.js 16 Proxy (src/proxy.ts)               │
│ - Runs early at the network boundary (Node.js runtime) │
│ - Refreshes expired Supabase session cookies           │
│ - Optimistic redirect for /dashboard -> /login         │
│ - Optimistic redirect for /login, /register -> /dash   │
│ - Zero slow database queries at this layer             │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Server Component Verification                 │
│ (src/lib/auth/server-auth.ts -> requireAuthUser())     │
│ - Authoritative identity verification on the server   │
│ - Uses Supabase verified claims (auth.getClaims()) or  │
│   server-verified lookup (auth.getUser())              │
│ - NEVER trusts raw client cookies or unvalidated       │
│   getSession() for authorization decisions             │
│ - Triggers server-side redirect('/login') if invalid   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Zustand In-Memory Identity Hydration          │
│ (src/stores/auth-store.ts + <AuthSync />)              │
│ - Client UI mirror for Name, Email, and UID            │
│ - Strictly non-sensitive display identity              │
│ - ZERO tokens, passwords, or raw session blobs stored  │
│ - No localStorage token storage                        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 4: Supabase Row Level Security (Future Sprints)   │
│ - Course, lesson, enrollment, and asset authorization  │
│ - Enforced directly in PostgreSQL at the data source   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Routes

| Canonical Route | Protection Level | Expected Behavior |
|---|---|---|
| `/login` | Public (Guest only) | Email/password sign-in form with field validation; redirects authenticated visitors to `/dashboard`. |
| `/register` | Public (Guest only) | Name, email, password, and password confirmation form. Handles both immediate-session and confirmation-required outcomes; redirects authenticated visitors to `/dashboard`. |
| `/dashboard` | Authenticated Only | Minimal walking skeleton proof page displaying user Name, Email, UID, and a working Sign out button. |
| `/` | Public Entry | Root canonical redirect: navigates to `/dashboard` if authenticated, otherwise to `/login`. |

---

## 3. Zustand Global State Contract

In accordance with the EduCore architectural blueprint, Zustand serves only as an in-memory client UI mirror:

```typescript
export interface SafeUser {
  id: string;    // Supabase user UID
  name: string;  // user_metadata.full_name or email prefix
  email: string; // user email
}

export interface AuthState {
  user: SafeUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setUser: (user: SafeUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearUser: () => void;
}
```

### State Security Rules:
1. **Cookie-backed Supabase session is the single source of truth.**
2. **Zustand stores only safe display identity.** Passwords, access tokens, refresh tokens, and raw session objects are never stored in Zustand.
3. **No localStorage token storage.** Avoids XSS token theft vectors.
4. **Hydrated cleanly via `<AuthSync initialUser={user} />`** during Server Component rendering to avoid hydration mismatches.
5. **Cleared immediately on sign-out.**

---

## 4. Supabase Setup & Configuration

### A. Environment Variables
Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

*Note: The code supports both `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.*

### B. Supabase Dashboard URL Configuration
1. Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2. **Site URL:**
   - Local development: `http://localhost:3000`
   - Vercel production: `https://<your-project-slug>.vercel.app`
3. **Redirect URLs (Allow list):**
   - `http://localhost:3000/**`
   - `https://<your-project-slug>.vercel.app/**`

### C. Email Confirmation Settings
Under **Authentication** -> **Providers** -> **Email**:
- **Option 1 (Email Confirmation Disabled - instant testing):** New accounts receive an active session immediately upon registration and route directly to `/dashboard`.
- **Option 2 (Email Confirmation Enabled - default Supabase production):** New accounts require email link verification. EduCore handles this honestly by displaying the "Verify your email" status screen with instructions, without granting unverified access to `/dashboard`.

---

## 5. Verification Matrix (Behaviors 1–10)

| ID | Behavior Requirement | Verification Method | Status |
|---|---|---|---|
| 1 | Anonymous visitor opens `/dashboard` -> redirected to `/login` | Next.js 16 `proxy.ts` + `requireAuthUser()` in Server Component; Playwright E2E | Verified |
| 2 | Anonymous visitor opens `/` -> redirected to `/login` | `src/app/page.tsx` + `proxy.ts`; Playwright E2E | Verified |
| 3 | Registration form submission and Supabase session/confirmation handling | `src/app/(auth)/register/page.tsx` handles both session and verification states | Verified |
| 4 | Authenticated visitor opens `/login` or `/register` -> redirected to `/dashboard` | `proxy.ts` redirects active sessions away from auth forms | Verified |
| 5 | Valid login establishes session and opens `/dashboard` | Supabase `signInWithPassword` + cookie persistence + router refresh | Verified |
| 6 | Dashboard displays correct Name, Email, and UID | `DashboardView.tsx` displays verified values with data-testid attributes | Verified |
| 7 | Refreshing `/dashboard` preserves authenticated session | Cookie-backed SSR session revalidated via `createServerClient` | Verified |
| 8 | Sign out clears UI identity and blocks subsequent dashboard access | `supabase.auth.signOut()` + `clearUser()` in Zustand + router refresh | Verified |
| 9 | Invalid credentials and validation errors displayed cleanly | Zod schema + React Hook Form field-level validation + error alerts | Verified |
| 10 | No token, password, or service-role key leaked in Zustand or bundles | Security test `tests/unit/security.test.mjs` verifying codebase & bundles | Verified |

---

## 6. Three-Minute QA Demo Script

### Step 1: Anonymous Access Protection (0:00 - 0:45)
1. Open the browser in an incognito window.
2. Navigate directly to `http://localhost:3000/dashboard`.
3. **Observe:** The application immediately redirects to `/login?redirectTo=%2Fdashboard`.
4. Navigate to `http://localhost:3000/`.
5. **Observe:** The application redirects to `/login`.

### Step 2: Form Validation & Error Handling (0:45 - 1:15)
1. On `/login`, click **Sign in** with empty fields.
2. **Observe:** "Email is required" and "Password is required" field-level errors appear.
3. Enter invalid email `test@` and short password `123`.
4. **Observe:** Format and minimum length validation errors are displayed.
5. Click **Create account** to navigate to `/register`.
6. Fill in different passwords in Password and Confirm Password.
7. **Observe:** "Passwords do not match" validation error is shown.

### Step 3: Registration & Confirmation State (1:15 - 1:45)
1. Enter valid details:
   - Full Name: `Demo Learner`
   - Email: `demo@example.com`
   - Password: `Password123!`
   - Confirm Password: `Password123!`
2. Click **Register**.
3. **Observe:** If email confirmation is enabled, the verification notice screen appears showing the target email and instructions without granting premature dashboard access.

### Step 4: Login, Dashboard Verification & Refresh (1:45 - 2:30)
1. Navigate to `/login` and sign in with confirmed credentials.
2. **Observe:** The application logs in and lands on `/dashboard`.
3. **Inspect Dashboard:**
   - Welcome banner: "Welcome, Demo Learner!"
   - Verified Identity card: Name (`Demo Learner`), Email (`demo@example.com`), and UID (`uuid-string`).
   - Zustand Store Status: `authenticated`.
4. Refresh the page (F5 / Cmd+R).
5. **Observe:** The session persists seamlessly without flicker or logout.

### Step 5: Sign Out & Route Re-lock (2:30 - 3:00)
1. Click the **Sign out** button in the header.
2. **Observe:** Zustand identity is cleared, Supabase cookie is invalidated, and user is redirected to `/login`.
3. Press the browser Back button or navigate to `/dashboard`.
4. **Observe:** Access is immediately denied and redirected back to `/login`.
