# Oryanda Saputra Portfolio — Project Specification

## Project Overview

This repository contains the professional portfolio website of Oryanda Saputra.

The system consists of a public professional portfolio and a private portfolio Admin Dashboard.

## Main Objectives

The portfolio must present professional identity, experience, education, technical capabilities, leadership experience, certifications, selected projects, professional case studies, downloadable CV access, and contact channels.

The private Admin Dashboard must allow portfolio content to be maintained without changing source code.

## Professional Positioning

Primary positioning:

- Full-Stack Web Developer

Supporting positioning:

- Informatics Engineering Graduate
- Web Application Development
- Software Engineering
- Operational and Data-Driven Web Applications

Networking remains a complementary technical capability.

## Content Source of Truth

The latest CV supplied by the portfolio owner is the initial source of truth.

Do not invent experience, responsibilities, achievements, technologies, project facts, dates, metrics, URLs, certifications, or credentials.

Missing information must remain optional and become manageable through the Admin Dashboard.

After initial seeding, the database becomes the runtime source of truth.

## Public Portfolio

Planned routes:

- `/`
- `/projects`
- `/projects/[slug]`
- `/contact` when useful

Planned homepage sections:

1. Hero
2. Professional Snapshot
3. Featured Work
4. About
5. Professional Experience
6. Technical Capabilities
7. Leadership & Organization
8. Education
9. Certifications
10. Additional Projects
11. Contact
12. Footer

Empty optional public sections must not be rendered.

## Private Admin

Admin uses routes under `/admin`.

There must be no Admin link in the public navigation, homepage, footer, or sitemap.

URL obscurity is not a security mechanism.

Admin resources require server-side authentication and authorization.

## Admin Registration

Do not provide public registration, social registration, or public Admin account creation.

The initial Admin account must use a controlled provisioning mechanism.

## Admin Modules

Planned modules:

- Dashboard
- Profile
- Experience
- Organizations
- Education
- Skills
- Projects
- Certifications
- Messages
- Media
- Settings
- Logout

The Admin is a focused portfolio CMS, not an enterprise CMS.

## Projects

Project management must eventually support name, slug, classification, organization/client context, descriptions, background, problem, solution, role, technologies, features, challenges, learning, URLs, dates, cover, screenshots, publication status, featured status, ordering, and confidentiality controls.

Publication status must use one explicit state:

- DRAFT
- PUBLISHED
- HIDDEN

Featured status is separate.

A project cannot be publicly featured unless it is published.

## Case Studies

A case study may contain Overview, Background, Problem, Solution, My Role, Key Features, Technology Stack, Technical Implementation, Challenges, Learning, Screenshots, and Relevant Links.

Missing optional fields must not create empty public sections.

## Confidentiality

Professional work must be presentable without exposing proprietary source code, private repositories, internal URLs, confidential credentials, sensitive operational data, or unauthorized screenshots.

Approved or dummy data may be used where necessary.

## Media

Admin media management will support profile photo, project covers, screenshots, certification media, and CV PDF.

Uploads must be validated server-side.

## CV Management

The active CV must be replaceable through Admin.

Public Download CV must use the current stored CV.

## Contact

The contact system may contain name, email, subject, and message.

Server protection must include validation, length limits, rate limiting, anti-spam, and safe errors.

## Technical Architecture

Primary stack:

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Motion when useful
- Lucide

Forms:

- React Hook Form
- Zod
- server-side validation

Persistence:

- Neon Serverless PostgreSQL
- Drizzle ORM

Media:

- Vercel Blob

Deployment:

- GitHub
- Vercel
- Neon

Dependencies are added only when required by the active stage.

## Architecture Principles

- Server Components by default.
- Client Components only when necessary.
- Public and Admin remain separated.
- Database access remains server-side.
- Business rules stay outside presentation components.
- Reusable abstractions are introduced only when justified.
- Avoid overengineering.

## Authentication

Admin authentication must eventually use secure password hashing, high-entropy sessions, HttpOnly cookies, Secure cookies in production, suitable SameSite configuration, expiration, revocation, server authorization, rate limiting, and generic login errors.

Client redirects are not authorization boundaries.

## Validation

Client validation improves UX.

Server validation is authoritative.

Database constraints protect persistence integrity.

## Security

Never expose database credentials to browsers, use `NEXT_PUBLIC_` for secrets, trust frontend validation as authoritative, store plain-text passwords, expose unpublished content, or rely on URL obscurity as access control.

Security is considered in every stage.

## SEO

The public site will eventually support metadata, canonical URL, Open Graph, social preview, dynamic project metadata, sitemap, robots rules, and structured data where useful.

Admin routes must be excluded from public discovery.

## Accessibility

Target a WCAG 2.2 AA-oriented implementation with semantic HTML, keyboard access, visible focus, labels, proper headings, contrast, alt text, accessible dialogs, touch targets, and reduced motion support.

## Performance

Prioritize Server Components, low client JavaScript, image optimization, appropriate caching, lazy loading below the fold, efficient queries, and limited third-party scripts.

## Responsive Design

Support mobile, tablet, laptop, and desktop based on content constraints rather than device assumptions.

## Non-Goals

Do not implement public user accounts, public registration, multi-admin RBAC, social login, blog, newsletter, comments, AI chatbot, real-time collaboration, or enterprise CMS features without an explicit future requirement.

## Git Strategy

Use Conventional Commits and keep logical responsibilities in separate commits.

## Stage Discipline

Only the explicitly requested stage may be implemented.

Do not implement future-stage functionality unless it is an unavoidable technical dependency.

## Production Architecture

GitHub → Vercel → Next.js → Neon PostgreSQL + Vercel Blob

## Success Criteria

Recruiters should quickly understand who Oryanda Saputra is, his professional focus, experience, applications built, contribution, technology stack, and contact options.

The portfolio owner must be able to maintain content through the private Admin Dashboard without changing source code.
