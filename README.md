# Oryanda Saputra — Professional Portfolio

Production-oriented professional portfolio for Oryanda Saputra.

The final application will present professional experience, software projects, technical capabilities, organization and leadership experience, education, certifications, and professional contact information.

A private Admin Dashboard will allow portfolio content to be updated without changing source code.

## Current Status

Current implementation:

**Stage 1 — Project Planning, Initialization & Next.js Foundation**

Implemented:

- Next.js;
- React;
- TypeScript;
- App Router;
- Tailwind CSS;
- Turbopack;
- ESLint;
- Prettier;
- TypeScript checking;
- environment convention;
- Public route group;
- custom 404;
- baseline HTTP security headers;
- project documentation.

Not implemented yet:

- database;
- authentication;
- Admin Dashboard;
- CMS;
- uploads;
- final design system;
- final public portfolio.

## Runtime

Required runtime:

```text
Node.js 24 LTS
npm
Git
```

## Installation

Install dependencies:

```bash
npm install
```

Create local environment:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Start development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Commands

```bash
npm run dev
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run start
npm run check
```

## Current Routes

Available:

```text
/
```

Not implemented yet:

```text
/projects
/projects/[slug]
/contact
/admin
```

`/admin` intentionally remains unavailable until authentication is implemented.

## Planned Architecture

```text
Public Internet
      │
      ▼
   Vercel
      │
      ▼
   Next.js
   ├── Public Portfolio
   ├── Private Admin
   └── Server Application Layer
           │
           ├── Neon PostgreSQL
           └── Vercel Blob
```

## Content

The latest CV supplied by the portfolio owner is the initial professional-content source of truth.

Missing content must not be invented.

After database seeding, runtime portfolio data will come from the database and be managed through the private Admin Dashboard.

## Environment Variables

See `.env.example`.

Never commit `.env` or `.env.local`.

Never expose private server credentials using `NEXT_PUBLIC_*`.

## Security

Stage 1 provides initial controls including powered-by header removal, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, restricted `Permissions-Policy`, and environment-file protection.

Authentication, authorization, session security, rate limiting, CSRF review, CSP, and media security are implemented in their relevant stages.

## Documentation

- `PROJECT_SPEC.md`
- `IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `docs/stages/`

## Git Convention

Use Conventional Commits and keep commits focused on one logical responsibility.

## Deployment Target

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ├── Neon PostgreSQL
   └── Vercel Blob
```

## License

This repository is a personal professional portfolio.

No permission for reuse or redistribution is granted unless a license is explicitly added later.

````

---

# Langkah 28 — Menyimpan Dokumentasi Tahap 1

Simpan **dokumen utama ini secara utuh** pada:

```text
docs/stages/STAGE_01_FOUNDATION.md
````
