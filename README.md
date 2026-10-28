<div align="center">

> Source prototype: administration field/type contracts require repair, and the current build needs additional Supabase configuration. See [verification](docs/VERIFICATION.md) before attempting local use.

# Business Reporting Portal

A role-based portal for publishing, organizing, and controlling access to embedded business reports.

**Next.js · TypeScript · Supabase**

</div>

## Overview

The application provides report browsing for users and administration screens for reports, accounts, and access rules. Supabase stores application data; server-side code uses a service-role client, and passwords are hashed with bcrypt.

## Highlights

- Report catalog with visibility and active-state controls.
- User administration and role-based access.
- Server actions and API routes for report and user operations.
- Responsive dashboard and administration screens.

## Tech stack

Next.js 15, React, TypeScript, Supabase, Tailwind CSS, and Radix UI components.

## Configuration

Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep the service-role key server-side and configure Supabase access policies and database schema before use. Do not commit environment files.

## Run locally

Requires Node.js and pnpm. Run `pnpm install`, configure the environment variables, then run `pnpm dev`. Use `pnpm build` for a production build.

## Security note

The application uses a custom cookie-based session flow and service-role database access. Review session protections, authorization rules, Supabase policies, and production configuration before deploying with real users or reports. This repository contains application code, not report data.


## Snapshot review

This is the Next.js/Supabase implementation, distinct from [Enterprise Indicators Portal](https://github.com/KauannOliver/enterprise-indicators-portal), which uses React/Vite and Netlify Functions. The support directory uses a fictitious contact. No internal reports are distributed.

Git-triggered Vercel deployment is disabled in the included web configurations. This update publishes source and documentation only.

## License

No new distribution license is granted for this corporate source edition. Public visibility does not grant reuse rights; obtain permission from the relevant rights holder. Existing third-party notices remain applicable.

## Dependency baseline

The original dependency manifest has peer conflicts. `npm install --legacy-peer-deps` is the compatibility install used for the snapshot checks; it does not resolve those upstream compatibility constraints. Dependency modernization remains a separate maintenance task. The inherited `next lint` script is incompatible with newer Next.js CLIs.

## Verification record

See [snapshot checks and remaining limitations](docs/VERIFICATION.md).
