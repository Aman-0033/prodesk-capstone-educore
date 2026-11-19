# EduCore — AI Architecture Prompt Log

This file records the AI prompts used to support product planning and frontend architecture. AI-generated recommendations are treated as proposals: scope, framework constraints, security, and implementation feasibility must be reviewed before adoption.

## Prompt 01 — Product scope and MVP definition

**Purpose:** Translate the RFP into a focused LMS product scope without introducing scope creep.

```text
Act as a senior product manager for an enterprise learning-management platform.
We are planning EduCore, an LMS capstone with a five-week delivery window.
The required modules are a learner dashboard, course catalog, lesson/video-player
experience, instructor portal for course asset uploads, and persistent progress
tracking. The engineering track is Advanced Frontend, and the framework must be
Next.js. Define the target users, core user journeys, P0 MVP requirements,
P1 enhancements, and explicit P2 exclusions. Keep the scope achievable for one
individual contributor. For every proposed feature, explain its user value,
dependencies, and delivery risk. Do not generate implementation code.
```

**Decision recorded:** MVP focuses on learner and instructor journeys. Payments, live classes, AI tutor, social/community features, and multi-tenant administration are deferred.

## Prompt 02 — Frontend technology and architecture decision

**Purpose:** Select a modern frontend architecture compatible with the mandatory Next.js constraint and an approved BaaS pathway.

```text
Act as a staff frontend architect. Propose an implementation architecture for
EduCore using Next.js App Router and TypeScript. The project is Frontend-track:
use a Backend-as-a-Service for authentication, persistence, and uploads; do not
introduce a custom Express backend. Evaluate Tailwind CSS, shadcn/ui, Zustand,
TanStack Query, form validation, Supabase, testing, and deployment choices.
Separate remote/server state from client UI state. Explain Server Component vs
Client Component boundaries, data-access abstractions, security boundaries,
trade-offs, and risks. Prefer a minimal stack that one developer can maintain.
Do not generate code.
```

**Decision recorded:** Next.js App Router, TypeScript, Tailwind, shadcn/ui, Zustand for UI state, TanStack Query for remote state, React Hook Form + Zod, Supabase Auth/PostgreSQL/Storage, Vitest/Testing Library/Playwright, and Vercel.

## Prompt 03 — State tree and mock API contract

**Purpose:** Prepare the required Frontend-track architecture deliverable.

```text
Act as a senior frontend systems designer. For EduCore, design a global state
ownership map and mock API contract list. Roles are Learner and Instructor.
Features include catalog search/filtering, learner dashboard, lesson player,
lesson completion/resume, instructor course drafts, lesson ordering, and asset
uploads. Use Zustand only for cross-route client UI state and TanStack Query for
remote data. Identify data that must not be duplicated in Zustand. Provide a
clear tree, endpoint method/path/purpose list, representative request/response
shapes, loading/error states, and optimistic-update cautions. The app will later
connect to Supabase through an adapter; mock endpoints are for frontend planning
and prototyping. Do not generate implementation code.
```

**Decision recorded:** State tree and mock REST-style endpoints are documented in `README.md`. Full schemas and fixture examples will be expanded in `docs/architecture/mock-api-contracts.md` during Phase 3.

## Prompt 04 — Learning experience UX requirements

**Purpose:** Convert the required learning workflow into screen-level interaction requirements for Figma.

```text
Act as a principal product designer specializing in premium SaaS and learning
products. Define the information architecture and interaction requirements
for EduCore's learner dashboard, course catalog/detail, and lesson player.
Prioritize clarity, progress visibility, content discovery, and low-distraction
learning. Specify the desktop and mobile behaviors, key components, empty/loading/
error states, keyboard interactions, and accessibility considerations. The
product should feel premium and editorial, not like a generic admin dashboard.
Use motion only when it clarifies state or feedback. Do not produce visual mockups
or implementation code; produce a Figma-ready screen specification.
```

**Decision recorded:** Design direction is content-first and learning-first. Detailed visual tokens and layouts will be decided in Phase 2 after screen specifications are reviewed.

## Prompt 05 — Instructor studio and upload workflow

**Purpose:** Keep course authoring within a realistic frontend MVP.

```text
Act as a senior UX architect for creator tools. Specify a focused instructor
studio for EduCore. Instructors must be able to create/edit course metadata,
add and reorder lessons, upload a cover image and lesson media, save drafts,
preview the learner experience, and publish/unpublish only their own courses.
Define the simplest safe workflow, required validation, upload progress/failure/
retry states, responsive behavior, and permission boundaries. Exclude video
transcoding, complex media processing, and advanced content review workflows.
Do not generate code.
```

**Decision recorded:** Asset uploads use Supabase Storage with explicit file validation and storage policies. The MVP does not include transcoding or adaptive bitrate delivery.

## Prompt 06 — Quality, accessibility, and performance review

**Purpose:** Establish measurable quality checks before implementation.

```text
Act as a frontend QA and accessibility lead. Review EduCore's planned MVP and
produce a test checklist for responsive behavior, keyboard navigation, screen
reader semantics, visible focus, form validation, reduced motion, loading/empty/
error states, and learner progress persistence. Include critical end-to-end
scenarios for Learner and Instructor roles. Include performance checks for
Next.js pages, media loading, image optimization, and Core Web Vitals. Identify
risks that could cause a capstone demo failure. Do not generate application code.
```

**Decision recorded:** The PRD defines WCAG 2.2 AA practices, responsive viewport targets, Core Web Vitals targets, and critical acceptance criteria.

## Prompt Governance

For future AI-assisted work:

1. Provide the relevant PRD section and current file/component context.
2. Ask the AI to state assumptions and identify missing requirements before proposing a change.
3. Require small, reviewable changes rather than a full project rewrite.
4. Require TypeScript-safe, accessible, responsive output and explicit loading/error/empty states.
5. Reject any feature that silently expands P0 scope.
6. Review security-sensitive decisions manually; client-side role checks are not authorization.
7. Record significant architecture decisions and update this prompt log when the project direction changes.

---

**Prompt log version:** 1.0 — Phase 1 planning
