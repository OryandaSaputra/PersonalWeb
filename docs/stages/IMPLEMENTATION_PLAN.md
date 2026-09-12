# Oryanda Saputra Portfolio — Implementation Plan

## Global Rules

Every stage must be documented in Markdown, implemented step-by-step, provide complete paths and full source files, include commands and configuration, document database/environment impact, include security considerations and verification, provide a checklist, and use logical Conventional Commits.

Do not start the next stage without explicit approval.

## Stage 1 — Project Planning, Initialization & Next.js Foundation

Scope:

- project initialization from zero;
- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- App Router;
- `src/`;
- Turbopack;
- ESLint;
- Prettier;
- type checking;
- Node runtime policy;
- environment convention;
- Git convention;
- Public route-group foundation;
- custom 404;
- baseline HTTP security headers;
- project documentation.

No database, authentication, Admin Dashboard, CMS, media management, or final UI.

## Stage 2 — Neon PostgreSQL, Drizzle & Database Foundation

Scope:

- Neon database;
- database environment setup;
- Drizzle ORM;
- database client;
- schema architecture;
- relationships;
- constraints;
- indexes;
- migrations;
- migration workflow;
- connection security;
- verification.

No Admin CRUD UI.

## Stage 3 — Design System, Theme & Shared Components

Scope:

- visual tokens;
- typography;
- colors;
- spacing;
- radius;
- elevation;
- responsive rules;
- animation tokens;
- light/dark/system modes;
- shadcn/ui;
- reusable UI components;
- loading, empty, and error states;
- accessibility foundation.

## Stage 4 — Admin Authentication & Security Foundation

Scope:

- Admin user;
- controlled provisioning;
- password hashing;
- login/logout;
- secure server session;
- HttpOnly cookie;
- expiration;
- revocation;
- protected routes;
- authorization;
- login rate limiting;
- generic errors.

No public registration.

## Stage 5 — Admin Layout & Dashboard

Scope:

- Admin layout;
- sidebar;
- header;
- responsive navigation;
- overview;
- summaries;
- quick actions;
- loading/error states;
- unauthorized handling.

## Stage 6 — Profile, Experience, Organization & Education CMS

Scope:

- Profile;
- Social Links;
- Professional Experience;
- Organization Experience;
- Education;
- CRUD;
- ordering;
- visibility;
- validation;
- authorization;
- database integrity.

## Stage 7 — Skills & Certifications CMS

Scope:

- skill categories;
- skills;
- ordering;
- visibility;
- certifications;
- credential metadata;
- server validation.

## Stage 8 — Project, Technology & Case Study CMS

Scope:

- Project CRUD;
- slugs;
- categories/classification;
- technologies;
- relationships;
- case-study fields;
- draft/published/hidden states;
- featured state;
- ordering;
- confidentiality controls;
- Admin preview.

## Stage 9 — Media, Gallery & CV Management

Scope:

- Vercel Blob;
- profile photo;
- project cover;
- screenshots;
- captions;
- alt text;
- ordering;
- certification media;
- CV PDF;
- CV replacement;
- upload validation;
- storage security;
- orphan handling.

## Stage 10 — Public Portfolio Homepage

Scope:

- public navigation;
- Hero;
- professional portrait;
- professional snapshot;
- Featured Work;
- About;
- Professional Experience;
- Technical Capabilities;
- Leadership & Organization;
- Education;
- Certifications;
- Projects CTA;
- Contact CTA;
- Footer;
- responsive design.

Only published data may appear publicly.

## Stage 11 — Projects & Professional Case Studies

Scope:

- `/projects`;
- `/projects/[slug]`;
- listing;
- professional case studies;
- gallery;
- stack;
- contribution;
- features;
- challenges;
- learning;
- links;
- unpublished-content protection;
- Admin preview.

## Stage 12 — Contact Form & Admin Messages

Scope:

- contact form;
- React Hook Form;
- Zod;
- server validation;
- anti-spam;
- rate limiting;
- persistence;
- Admin inbox;
- Read/Unread/Archived.

## Stage 13 — SEO, Metadata, Sitemap & Social Preview

Scope:

- production metadata;
- canonical URL;
- Open Graph;
- social preview;
- dynamic project metadata;
- sitemap;
- robots;
- favicon;
- JSON-LD where useful.

Admin routes remain excluded from public discovery.

## Stage 14 — Responsive, Accessibility, Performance & Security Audit

Scope:

- responsive QA;
- accessibility QA;
- keyboard and focus review;
- contrast;
- reduced motion;
- image performance;
- client bundle review;
- query review;
- authentication audit;
- authorization audit;
- CSRF review;
- rate limiting review;
- upload security;
- CSP;
- dependency audit;
- secret-exposure audit.

## Stage 15 — Production Deployment & Verification

Scope:

- GitHub verification;
- Vercel;
- Neon production database;
- Vercel Blob;
- production environment variables;
- migrations;
- Admin provisioning;
- custom domain;
- HTTPS;
- security verification;
- SEO verification;
- CV verification;
- contact verification;
- mobile verification;
- unauthorized-access verification;
- backup/recovery considerations.

## Stage Completion Rule

A stage is complete only when scope is complete, formatting/lint/typecheck/build pass, relevant security and functional checks pass, documentation is complete, and logical Git commits are created.

The next stage must not start until explicitly requested.
