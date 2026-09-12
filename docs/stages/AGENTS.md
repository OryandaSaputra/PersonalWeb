## Project

This repository contains the professional portfolio website of Oryanda Saputra.

Before modifying the repository, read:

1. `PROJECT_SPEC.md`
2. `IMPLEMENTATION_PLAN.md`
3. `README.md`
4. the current document under `docs/stages/`

## Core Stack

Planned stack:

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Neon PostgreSQL
- Drizzle ORM
- Vercel
- Vercel Blob

Do not install dependencies before their implementation stage requires them.

## Source of Truth

The latest CV explicitly supplied by the portfolio owner is the initial professional-content source of truth.

Do not invent experience, positions, responsibilities, achievements, projects, dates, skills, technologies, certifications, credential IDs, URLs, or metrics.

Missing information must remain optional.

## Stage Discipline

Work only on the explicitly requested stage.

Do not silently implement future stages.

If a future-stage dependency is technically unavoidable, explain it, implement the minimum, document the decision, and do not expand its scope.

## Documentation Rules

Each stage requires complete Markdown documentation containing objectives, features, affected files, full paths, complete source files, commands, configuration, database impact, environment variables, security considerations, verification, checklist, and Git commits.

Do not use placeholders such as `...`, `existing code`, `other code remains the same`, or `rest of file` for files that must be copied or replaced.

Generated files such as `package-lock.json`, `next-env.d.ts`, `.next/*`, and `node_modules/*` are created by tools and must not be manually authored.

## Git Rules

Use Conventional Commits.

Common prefixes:

- `feat:`
- `fix:`
- `refactor:`
- `chore:`
- `docs:`
- `test:`
- `perf:`
- `style:`

Keep one logical responsibility per commit.

Before committing, review changes, confirm files belong to the same logical unit, and verify that no secret is staged.

## Architecture Rules

Prefer pragmatic feature-oriented architecture.

Use Server Components by default, Client Components only where required, server-only database access, clear Public/Admin separation, typed interfaces, reusable components when real reuse exists, explicit validation, and business logic outside presentation components.

Avoid unnecessary abstraction, premature generic repositories, giant components, giant utility files, duplicated domain rules, unnecessary global state, microservices, and overengineering.

## Public and Admin Separation

There must be no Admin link in public Navbar, Homepage, Footer, or Sitemap.

A hidden `/admin` URL is not a security mechanism.

Admin resources require server-side authentication and authorization.

## Authentication Rules

When implemented, use secure password hashing, high-entropy sessions, HttpOnly cookies, Secure cookies in production, appropriate SameSite policy, expiration, revocation, login rate limiting, and generic authentication errors.

Do not implement public Admin registration.

## Authorization Rules

Every protected mutation must validate authentication, authorization, request input, and domain rules before persistent changes.

Never use client-side redirects as the only access-control boundary.

## Security Rules

Never expose database credentials to the browser, use `NEXT_PUBLIC_` for secrets, trust frontend validation as authoritative, store plain-text passwords, expose unpublished data, disable protection merely to make a feature work, or commit `.env.local`.

## Validation Rules

Client validation improves UX.

Server validation is authoritative.

Database constraints protect persistence integrity.

## Upload Rules

When uploads are introduced, authenticate, authorize, validate MIME/type/size, generate safe paths, avoid trusting original filenames, prevent accidental private-media exposure, and handle orphaned uploads.

## UI Direction

The portfolio must feel modern, professional, clean, technology-oriented, recruiter-friendly, polished, and restrained.

Avoid generic student portfolio styling, percentage skill bars, fake metrics, excessive glow/gradients, meaningless charts, constant animation, and scroll hijacking.

Projects are primary evidence. Skills support project evidence.

## Accessibility Rules

Always consider semantic HTML, heading hierarchy, keyboard navigation, visible focus, labels, error feedback, contrast, alt text, dialog behavior, touch targets, and reduced motion.

## Responsive Rules

Build mobile-friendly interfaces from the beginning and check hierarchy, overflow, navigation, forms, tables, dialogs, typography, and touch interaction.

## Error Handling

Do not use browser `alert()` as final production feedback.

Provide appropriate loading, empty, validation, request error, network error, unauthorized, not-found, expired-session, and upload-error states.

## Quality Gate

Before completing a stage, run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Do not suppress errors simply to make validation pass.

## Dependency Policy

Add a dependency only when the current stage requires it, it solves a clear problem, built-in capability is insufficient, and maintenance cost is justified.

## Environment Rules

Never commit `.env`, `.env.local`, database credentials, session secrets, or Blob write tokens.

`.env.example` may include variable names and safe placeholders.

## Documentation Synchronization

When architecture changes, update `PROJECT_SPEC.md`, `IMPLEMENTATION_PLAN.md` when stage boundaries change, relevant stage documentation, and `README.md` when developer workflow changes.

## Final Principle

Build the smallest architecture that correctly satisfies approved requirements while preserving security, maintainability, accessibility, type safety, responsive behavior, and appropriate scalability.
