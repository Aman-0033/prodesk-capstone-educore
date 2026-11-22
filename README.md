# EduCore — Enterprise Learning Management Platform

> **Tagline:** Learn with direction. Teach with impact.
>
> **Blueprint status:** Phase 1 — Product Requirements Document (PRD)
> **Engineering track:** Frontend Specialist (Advanced)
> **Repository:** `prodesk-capstone-educore`

---

## 1. Product Overview

EduCore is a modern, role-aware Learning Management System (LMS) designed to make self-paced professional learning simple for learners and course publishing efficient for instructors.

The MVP brings together a discoverable course catalog, a personalized learner dashboard, a focused lesson experience with a video-player interface, persistent learning progress, and an instructor workspace for creating courses and uploading learning assets.

EduCore is being developed as an **advanced frontend capstone**. The application will use Next.js and a Backend-as-a-Service (BaaS) for authentication, persistence, and file storage. It will not include a separately developed Express/Node backend in this track.

### Product proposition

- **For learners:** Find relevant courses, understand what each course offers, continue lessons without losing progress, and see learning progress clearly.
- **For instructors:** Create and organize courses, upload course assets, save drafts, preview content, and publish courses through a guided workflow.
- **For the platform:** Present a consistent, accessible, responsive learning experience with clear role boundaries and maintainable frontend architecture.

## 2. Problem Statement

Learners often experience fragmented course discovery, unclear learning paths, and poor visibility into their progress. Instructors may have to work across disconnected tools to organize course content and publish learning materials.

EduCore addresses these problems with one coherent interface that connects course discovery, enrollment, lesson consumption, progress tracking, and course authoring.

## 3. Product Goals and Success Criteria

### Goals

1. Make the path from course discovery to starting a lesson obvious and low-friction.
2. Give learners a useful dashboard centered on continuing and completing learning.
3. Provide a reliable lesson experience with clear curriculum navigation and progress feedback.
4. Let instructors create, edit, organize, and publish courses without needing a separate content-management tool.
5. Establish reusable frontend patterns, typed data contracts, accessible components, and responsive layouts.

### MVP success criteria

- A learner can sign in, browse and filter the catalog, open a course, enroll in a free course, start a lesson, complete it, and see progress update.
- A learner can leave a course and return to the correct next or last-viewed lesson.
- An instructor can create a course draft, add and reorder lessons, upload a cover image and lesson media, preview the course, and publish it.
- Learner and instructor navigation is role-aware; unauthorized users cannot access instructor workflows.
- All primary journeys work at desktop, tablet, and mobile viewport sizes.
- Every data-driven screen includes loading, empty, error, and success states.

## 4. Target Users and Roles

| Role | Primary needs | MVP permissions |
|---|---|---|
| Learner | Discover courses, enroll, study, and track progress | Browse published courses, enroll in free courses, access enrolled course lessons, update own progress |
| Instructor | Create and maintain learning content | Create and edit own courses, manage lessons, upload assets, save drafts, publish own courses |
| Platform administrator | Govern platform content and users | **Not a full MVP role or dashboard.** Admin moderation and platform-wide analytics are post-MVP candidates. |

The initial MVP supports two end-user roles: **Learner** and **Instructor**. A user may be granted one role in the initial release. Multi-role switching and organization-level roles are out of scope unless required by later evaluation feedback.

## 5. Scope and Prioritization

### P0 — MVP / mandatory capstone scope

| ID | Feature | Description |
|---|---|---|
| F-01 | Authentication and role-aware access | Sign up, sign in, sign out, session handling, and Learner/Instructor route protection |
| F-02 | Course catalog | Browse published courses with keyword search, category/level filters, sorting, and responsive course cards |
| F-03 | Course detail | Course overview, instructor information, curriculum outline, lesson count, duration, and enrollment action |
| F-04 | Learner dashboard | Continue learning, enrolled courses, completion progress, and recently accessed content |
| F-05 | Learning workspace | Lesson video area, lesson information, curriculum sidebar/drawer, previous/next lesson navigation, and completion action |
| F-06 | Progress tracking | Persist lesson completion and last-viewed lesson; calculate course completion from completed lessons |
| F-07 | Instructor workspace | Instructor overview and a list of the instructor's courses with status indicators |
| F-08 | Course authoring | Create/edit course metadata, add/edit/reorder lessons, save draft, preview, and publish/unpublish own courses |
| F-09 | Asset upload UI | Upload course cover images and lesson media to approved storage buckets with validation and upload feedback |
| F-10 | Responsive and accessible UI | Keyboard operation, semantic structure, readable contrast, reduced-motion support, and responsive behavior |

### P1 — Valuable enhancements, only after P0 is stable

- Lesson bookmarks and personal notes.
- Course completion certificate view/download.
- Instructor-level course performance summary (enrollments and completion rates).
- Better catalog discovery such as featured collections and recently added courses.
- Skeleton loading and optimistic progress updates where they improve perceived speed without hiding failures.

### P2 — Explicitly deferred / not part of the MVP

- Paid subscriptions, checkout, Stripe, or Razorpay.
- Live classes, video conferencing, chat, and community feeds.
- AI tutor, AI course generation, or complex recommendation models.
- Multi-tenant organization administration and enterprise SSO.
- Video transcoding, adaptive bitrate streaming, DRM, and a custom media delivery pipeline.
- Native iOS/Android applications.

**Scope rule:** P1 and P2 work must not delay the P0 learner and instructor journeys. The MVP uses free/demo courses; payment processing is deliberately excluded.

## 6. Primary User Journeys

### Learner journey

1. Open EduCore and browse the published course catalog.
2. Search or filter by category and skill level.
3. Open a course detail page and review its overview and curriculum.
4. Sign in or create an account if needed.
5. Enroll in the free course.
6. Open the learner dashboard and select **Continue learning**.
7. Watch a lesson, navigate the curriculum, and mark the lesson complete.
8. Leave the course and return later; progress and the last-viewed lesson are retained.

### Instructor journey

1. Sign in with an instructor account.
2. Open the instructor workspace.
3. Create a course draft and add title, description, category, level, and cover image.
4. Add curriculum sections/lessons and upload lesson media.
5. Reorder lessons and preview the learner-facing course page.
6. Publish the course after required fields and content checks pass.
7. Return later to edit or unpublish the instructor's own course.

## 7. Functional Requirements

### Authentication and access

- The app must provide sign-up, sign-in, and sign-out flows.
- The signed-in user's role must determine the navigation and available actions.
- Learner-only and instructor-only routes must have explicit access guards.
- Instructor users may modify only their own courses and assets.
- A logged-out visitor may browse public course pages but must authenticate before enrolling or accessing protected learning features.

### Catalog and course detail

- Catalog data must support search, category, skill level, and sort controls.
- Only published courses are visible in the public catalog.
- Course detail must show the course description, instructor, curriculum, lesson count, and estimated duration.
- The enrollment action must prevent duplicate enrollment records.

### Learner dashboard and learning workspace

- The dashboard must prioritize active courses and provide a clear resume action.
- The player view must show lesson content, course curriculum, and navigation controls.
- The learner must be able to mark a lesson complete and move to the next lesson.
- Course completion percentage must be derived from the learner's completed lessons rather than maintained as an unrelated manual value.
- The last-viewed lesson must be retained for each active enrollment.
- Player controls must remain usable on narrow screens; the curriculum panel may become a drawer or collapsible sheet on mobile.

### Instructor authoring and assets

- Instructors must be able to create, edit, save, preview, publish, and unpublish their own courses.
- Lessons must support title, description, order, duration, and a media reference.
- The UI must validate required fields and accepted file types before upload.
- Upload states must include queued, uploading, complete, and failed, with a retry path for failed uploads.
- The MVP does not perform video transcoding or guarantee adaptive streaming; uploaded media is stored and delivered as a file or supported media URL.

## 8. Non-Functional Requirements

### Usability and accessibility

- Target WCAG 2.2 AA practices for semantic structure, keyboard access, visible focus, contrast, labels, and error messaging.
- Respect `prefers-reduced-motion`; animation must never be required to understand or operate a control.
- Use consistent empty, loading, disabled, validation, and error states.
- Avoid hover-only interactions and ensure touch targets work on mobile.

### Responsive design

- Design mobile-first, then optimize for tablet and desktop.
- Validate at minimum widths around 360 px, 768 px, 1024 px, and 1440 px.
- Navigation, course cards, curriculum panels, forms, and tables/lists must adapt without horizontal overflow.

### Performance

- Use Next.js Server Components for suitable read-only and public content; use Client Components only where interactivity or browser APIs are required.
- Optimize images, defer non-critical media, and avoid unnecessary client-side JavaScript.
- Set a quality target of Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 on representative pages where measurement is available.

### Reliability and maintainability

- Use TypeScript strict mode and shared domain types for data contracts.
- Keep data access behind service/repository functions so mock data and Supabase can be switched without rewriting UI components.
- Do not duplicate server/remote data in the global Zustand store; use the query cache for remote data and Zustand for cross-route client UI state.
- Handle network errors and failed mutations with visible feedback and safe retry behavior.

### Security and privacy

- Use Supabase Auth and Row Level Security (RLS) policies for data authorization; frontend route guards are a UX measure, not the security boundary.
- Never expose a Supabase service-role key or other privileged secret in browser code.
- Enforce ownership rules for instructor-owned courses and learner-owned enrollments/progress in the data layer.
- Restrict storage bucket access with storage policies; validate file type and size in the UI and enforce policy/limits at storage configuration level.
- Use demo/sample learner information only; do not store real sensitive personal data in the capstone.

## 9. Proposed Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js App Router | Mandatory frontend framework; file-based routing, layouts, and Server/Client Component composition |
| Language | TypeScript (strict) | Typed props, domain models, API contracts, and safer refactoring |
| UI styling | Tailwind CSS | Responsive utility-first styling and design tokens |
| Component foundation | shadcn/ui + Radix primitives | Accessible, composable UI primitives customized for EduCore's visual identity |
| Icons | Lucide React | Consistent interface iconography |
| Motion | Motion for React | Restrained micro-interactions and transitions; reduced-motion support required |
| Client state | Zustand | Small global UI state such as player controls, sidebar state, and active authoring UI state |
| Remote/server state | TanStack Query | Query caching, mutations, loading/error lifecycle, and cache invalidation for interactive data flows |
| Forms and validation | React Hook Form + Zod | Typed forms and schema-based validation |
| Backend-as-a-Service | Supabase Auth + PostgreSQL + Storage | Authentication, relational persistence, and course asset storage without a custom Express backend |
| Charts | Recharts (only if needed for P1) | Small progress/performance visualizations |
| Testing | Vitest + React Testing Library + Playwright | Unit/component tests and critical end-to-end journeys |
| Hosting | Vercel | Next.js deployment and preview environments |
| Source control | Git + GitHub | Version control, issues, and project documentation |

**Implementation note:** Supabase's current SSR integration uses `@supabase/ssr` for cookie-based sessions and is currently documented as beta. Check the installed package version and current official guide during implementation because its API may change. Keep the authentication/data adapter isolated so the decision does not leak into UI components.

## 10. Frontend Architecture

### Architectural style

The application will use a feature-oriented Next.js App Router structure. Routes own page composition; reusable components own visual primitives; feature modules own their domain UI and hooks; service modules own data access and mapping.

### Proposed source structure

```text
src/
├── app/
│   ├── (public)/
│   │   ├── courses/
│   │   └── courses/[slug]/
│   ├── (auth)/
│   │   ├── login/           # canonical Sprint 14 route: /login
│   │   └── register/        # canonical Sprint 14 route: /register
│   ├── (protected)/
│   │   └── dashboard/      # canonical Sprint 14 route: /dashboard
│   ├── (learner)/
│   │   └── learn/[courseId]/[lessonId]/
│   └── (instructor)/
│       ├── instructor/
│       └── instructor/courses/
├── components/
│   ├── ui/                 # customized shadcn/ui primitives
│   ├── layout/             # navigation, shell, responsive containers
│   └── shared/             # reusable cross-feature components
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── courses/
│   ├── learning/
│   ├── progress/
│   └── instructor-studio/
├── lib/
│   ├── supabase/           # browser, server, and request-session utilities
│   ├── data/               # repository interfaces and adapters
│   ├── validation/         # shared Zod schemas
│   └── utils/
├── stores/                 # Zustand stores (client UI state only)
├── types/                  # shared domain and API types
└── test/                   # test utilities and fixtures
```

### Rendering and data flow

- Public catalog and course-detail content should use server rendering where it benefits initial load and discoverability.
- Interactive elements such as catalog filters, the lesson player, progress controls, and the instructor authoring interface should be Client Components.
- UI components call feature hooks; hooks call repository/service functions; services use either the mock adapter or Supabase adapter.
- TanStack Query owns remote data caching and mutation lifecycle. Zustand owns cross-route client UI state only.
- Supabase authorization policies remain authoritative; hiding a button or blocking a route on the client is not sufficient access control.

## 11. Frontend Global State Tree

The following is the planned Zustand state boundary. During Sprint 14, implement only the safe auth identity mirror and essential application UI state. Remote records (course lists, course details, enrollment records, profile data) should remain in TanStack Query rather than being copied into Zustand.

```text
EduCoreStore
├── auth
│   ├── user
│   │   ├── id       # Supabase UID; safe display identity only
│   │   ├── name
│   │   └── email
│   └── status       # loading | authenticated | unauthenticated
├── authUi
│   ├── authDialogOpen
│   └── postLoginRedirect
├── appUi
│   ├── sidebarCollapsed
│   ├── mobileNavigationOpen
│   ├── themePreference
│   └── commandMenuOpen
├── catalogUi
│   ├── searchTerm
│   ├── selectedCategory
│   ├── selectedLevel
│   └── sortOrder
├── playerUi
│   ├── activeCourseId
│   ├── activeLessonId
│   ├── isPlaying
│   ├── playbackRate
│   ├── volume
│   └── curriculumPanelOpen
└── instructorUi
    ├── activeCourseDraftId
    ├── activeEditorSection
    ├── hasUnsavedChanges
    └── uploadQueue
```

**State ownership rules:**

- Supabase cookie-backed Auth is the source of truth for identity/session. Zustand may hold only an in-memory, server-verified display identity (`id`, `name`, `email`) and a loading/auth status for dashboard UI synchronization. Never store passwords, access tokens, refresh tokens, or raw sessions in Zustand.
- `authUi` contains only temporary presentation/navigation state.
- Course, lesson, enrollment, and progress records are remote data and belong in TanStack Query.
- Playback position and durable lesson completion must be persisted through the data service; ephemeral controls may live in Zustand.
- Draft course form values should primarily live in the form state; Zustand should only hold editor-wide UI state that must survive navigation between authoring subviews.

### Diagram deliverable

The exported state-tree diagram will be added at `public/diagrams/educore-state-tree.png` and embedded here before blueprint submission:

> **Pending Phase 3:** `public/diagrams/educore-state-tree.png` — replace this note with the exported diagram image before submitting the README.

## 12. Mock API Contracts

The Frontend track requires an explicit API plan. During UI development, these REST-style contracts will be mocked with typed fixtures/MSW or a local mock adapter. The production-facing data adapter will later call Supabase directly; no Express API server is planned.

| Method | Mock endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/sign-up` | Create learner/instructor account (mock contract only; Supabase Auth in integration) |
| POST | `/api/auth/sign-in` | Sign in and establish a session (mock contract only; Supabase Auth in integration) |
| GET | `/api/me` | Return current profile and role |
| GET | `/api/courses` | List published courses with search/filter/sort query parameters |
| GET | `/api/courses/:courseId` | Return course metadata and curriculum |
| POST | `/api/courses/:courseId/enrollments` | Enroll the current learner in a free course |
| GET | `/api/me/dashboard` | Return enrolled courses, recent activity, and resume targets |
| GET | `/api/courses/:courseId/progress` | Return lesson completion and course progress for current learner |
| PATCH | `/api/lessons/:lessonId/progress` | Mark a lesson complete or update last-viewed position |
| GET | `/api/instructor/courses` | List courses owned by the current instructor |
| POST | `/api/instructor/courses` | Create a course draft |
| PATCH | `/api/instructor/courses/:courseId` | Update course metadata or publication state |
| POST | `/api/instructor/courses/:courseId/lessons` | Add a lesson to a course |
| PATCH | `/api/instructor/lessons/:lessonId` | Edit or reorder a lesson |
| POST | `/api/instructor/assets` | Mock asset-upload contract; real file bytes go to Supabase Storage |

All request and response bodies will be TypeScript types. Error responses should use a consistent shape such as `{ code, message, fieldErrors? }`. The final mock contract examples and fixtures will be documented in `docs/architecture/mock-api-contracts.md` during the architecture phase.

## 13. Conceptual Data Domains

Although the Frontend track deliverable is a state tree rather than a database ERD, the UI will be built against the following domain concepts:

- **Profile:** user ID, display name, avatar, role.
- **Course:** title, slug, description, category, level, instructor ID, cover asset, status, estimated duration.
- **Lesson:** course ID, section label/order, title, description, duration, media asset reference, lesson order.
- **Enrollment:** learner ID, course ID, enrolled timestamp, last-viewed lesson ID.
- **Lesson progress:** learner ID, lesson ID, completion state, last position, updated timestamp.
- **Asset:** storage path, asset type, mime type, size, owner ID, and related course/lesson reference.

These concepts map naturally to Supabase Auth, PostgreSQL tables, and Storage objects. The final storage and access policies will be configured before real learner or instructor data is used.

## 14. UI/UX Direction (Initial Product Direction)

EduCore should feel like a premium learning product rather than a generic admin template. The interface should be content-first, calm, focused, and highly legible.

### Design principles

- **Learning-first hierarchy:** the next lesson and course progress are more important than decorative statistics.
- **Editorial course discovery:** strong course imagery, deliberate typography, concise metadata, and clear category/filter controls.
- **Focused player workspace:** generous media area, low-distraction controls, visible curriculum context, and obvious next-lesson actions.
- **Instructor clarity:** a guided authoring flow with clear draft/published states, inline validation, upload feedback, and preview.
- **Purposeful motion:** subtle transitions and micro-interactions; no constant animation or decorative 3D that competes with learning content.
- **Consistent responsive behavior:** navigation and curriculum panels adapt to mobile without removing key actions.

The exact palette, type system, spacing tokens, component styling, and high-fidelity screens will be finalized in the Figma phase after the complete product content and visual references are reviewed.

## 15. Sprint 14 Walking Skeleton — Authentication and Routing

Sprint 14 is a separate implementation milestone with a narrower scope than the full LMS MVP. Its delivery gate is a working, deployable authentication pipeline. The application must not begin course catalog, lesson player, instructor studio, or progress-tracking implementation until authentication and protected routing are stable.

### Canonical routes

| Route | Access | Expected behavior |
|---|---|---|
| `/login` | Public while signed out | Email/password sign-in; authenticated visitors are redirected to `/dashboard` |
| `/register` | Public while signed out | Name/email/password registration; authenticated visitors are redirected to `/dashboard` |
| `/dashboard` | Authenticated only | Minimal proof page showing the current user's name, email, UID, and sign-out action |
| `/` | Public entry | Redirect to `/dashboard` when authenticated, otherwise `/login` |

### Sprint 14 acceptance criteria

1. Login, registration, and dashboard routes are implemented in the Next.js App Router.
2. Supabase Auth handles email/password registration and login; sessions are stored using the current Supabase SSR cookie integration.
3. The dashboard is protected by an early request-level redirect and a separate server-side verified identity check. The request interceptor is not treated as the sole authorization boundary.
4. The Next.js request interception filename matches the installed version: `proxy.ts` on Next.js 16; `middleware.ts` on Next.js 15 and earlier.
5. Zustand is synchronized with a safe display identity containing only `id`, `name`, and `email`, plus an authentication status. Passwords and tokens are never stored in Zustand or localStorage.
6. Registration handles both immediate-session and email-confirmation-required outcomes without pretending an unverified account is authenticated.
7. Refreshing the dashboard preserves a valid session; signing out clears the session and blocks subsequent dashboard access.
8. The app builds for production and is deployed to Vercel with environment variables and Supabase redirect URLs configured.
9. The QA demo shows registration, login, protected dashboard access, refresh persistence, and sign-out.

### Security notes

- Verify server identity with Supabase verified claims (`auth.getClaims()`) or a server-confirmed user lookup (`auth.getUser()`). Do not use `getSession()` alone as an authorization check in server code because its cookie/session payload is not itself revalidated.
- The request interceptor should perform fast session refresh and optimistic redirects; enforce data permissions at the data source with Supabase Row Level Security (RLS).
- Keep service-role keys server-only and out of browser bundles. Commit only an `.env.example` with placeholder values, never `.env.local` or real credentials.

### Supabase environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Implementation prompt: [`Sprint14-Antigravity-Prompt.md`](Sprint14-Antigravity-Prompt.md).

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Scope expands into a full marketplace | Keep payments, community, live classes, AI, and multi-tenant admin outside P0 |
| Video uploads exceed free-tier limits | Use short demo assets, enforce clear size/type limits, and document the storage plan; do not promise transcoding |
| Learner progress becomes inconsistent | Derive course progress from lesson-level records and test resume/completion flows |
| Role checks exist only in the UI | Enforce authorization with Supabase RLS and Storage policies |
| Zustand becomes a duplicate database | Keep remote data in TanStack Query and restrict Zustand to UI state |
| Visual polish harms usability/performance | Use purposeful motion, reduced-motion support, optimized images, and measurable performance checks |

## 17. Delivery Roadmap

| Sprint | Focus | Expected outcome |
|---|---|---|
| Sprint 13 | Blueprint and planning | PRD, Figma wireframes, state-tree diagram, prompt log, repository setup |
| Sprint 14 | Walking Skeleton — authentication and routing | Next.js App Router scaffolding for `/login`, `/register`, and `/dashboard`; Supabase Auth; cookie-backed session persistence; protected-route redirects; server-side identity verification; Zustand safe-user synchronization; Vercel deployment and QA demo. Do not begin catalog, player, instructor, or progress features until this pipeline is stable. |
| Sprint 15 | Core learning and authoring | Course catalog/detail, learner learning dashboard, lesson player, progress persistence, and instructor course authoring/uploads |
| Sprint 16 | Quality and enhancement | P1 candidates only if P0 is stable, responsive/accessibility/performance polish, comprehensive testing |
| Sprint 17 | Release | Production configuration, CI checks, Vercel deployment, QA demo, final documentation |

## 18. Blueprint Deliverables and Links

| Deliverable | Status | Link/location |
|---|---|---|
| Public GitHub repository | To create | `https://github.com/YOUR_GITHUB_USERNAME/prodesk-capstone-educore` |
| PRD / README | Drafted in Phase 1 | `README.md` |
| AI prompt log | Drafted in Phase 1 | `Prompts.md` |
| Figma wireframes (minimum 3 viewports) | Pending Phase 2 | **Add public Figma link here before submission** |
| Frontend state-tree diagram | Pending Phase 3 | `public/diagrams/educore-state-tree.png` |
| Mock API contract detail | Pending Phase 3 | `docs/architecture/mock-api-contracts.md` |
| QA demo video | Pending final submission | **Add demo video URL here** |

### Required Figma screens (planned)

1. Authentication screen (sign in / sign up).
2. Learner dashboard with enrolled courses and continue-learning area.
3. Course catalog and course detail view.
4. Lesson player / learning workspace.
5. Instructor course studio (course editor and asset upload).

At minimum, the Figma file will include desktop and mobile behavior for the core journeys; the exact audited viewport count will be confirmed against the assignment rubric.

## 19. Repository Setup

Create a **public** repository named:

```text
prodesk-capstone-educore
```

Suggested initial repository contents:

```text
prodesk-capstone-educore/
├── README.md
├── Prompts.md
├── Sprint14-Antigravity-Prompt.md
├── docs/
│   └── architecture/
│       └── mock-api-contracts.md
└── public/
    └── diagrams/
        └── educore-state-tree.png
```

After creating the public repository on GitHub, add these files and replace every pending link/diagram note before the final blueprint submission.

---

## 20. Official Technical References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui — Next.js installation](https://ui.shadcn.com/docs/installation/next)
- [Zustand — create store](https://pmnd.rs/docs/apis/create)
- [TanStack Query — queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)
- [Motion for React](https://motion.dev/docs/react-animation)
- [Supabase Auth SSR guidance](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Document owner:** EduCore Capstone — Frontend Specialist
**Version:** 1.1 — Phase 1 PRD + Sprint 14 walking-skeleton scope
