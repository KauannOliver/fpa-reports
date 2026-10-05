<div align="center">

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
