# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16, React 19, TypeScript application for a medical directory. Route files live in `src/app`, with pages such as `src/app/page.tsx`, `src/app/directorio/page.tsx`, and `src/app/perfil/page.tsx`. Shared UI and page sections are in `src/components`, with reusable primitives under `src/components/ui`. Domain code is grouped in `src/features`, especially `src/features/profile` and `src/features/directory`. Shared constants and Supabase clients live in `src/lib`. Static assets, videos, and the map HTML are in `public`. Database reference files are at the repo root: `schema.sql`, `schema.dbml`, and `seed.sql`.

## Build, Test, and Development Commands

Use `pnpm` for local work because the repo includes `pnpm-lock.yaml`.

- `pnpm dev`: start the Next.js development server.
- `pnpm build`: create a production build and run Next.js checks.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: run ESLint using `eslint-config-next` core web vitals and TypeScript rules.

## Coding Style & Naming Conventions

Write React components in TypeScript (`.tsx`) and keep component names in PascalCase, for example `ProfileHero` or `AppointmentModal`. Hooks should use the `use-`/`use*` naming pattern, as in `use-profile-editor.ts` and `useSpecialtyColors`. Follow the local style in the file you edit: most files use 2-space indentation, typed props, and Tailwind utility classes. Prefer the `@/*` path alias for project imports. Keep shared UI primitives in `src/components/ui` and feature-specific components inside their feature folder.

## Testing Guidelines

No dedicated test framework or `test` script is currently configured. Before submitting changes, run `pnpm lint` and `pnpm build`. For future tests, place focused tests near the feature they cover, use descriptive names such as `profile-editor.test.tsx`, and cover form validation, Supabase data mapping, and route-level behavior when changed.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often `fix ...`, `add ...`, or Conventional Commit prefixes such as `fix:`, `perf:`, and `security:`. Prefer `type: concise summary`, for example `fix: validate profile editor hours`. Pull requests should include a clear description, linked issue when available, screenshots for UI changes, and notes for any database, environment, or Supabase policy changes.

## Security & Configuration Tips

Copy `.env.example` to `.env` for local configuration and never commit real secrets. Keep `TURNSTILE_SECRET_KEY` server-only. Treat Supabase service-role keys as secrets; only public anon configuration belongs in browser-exposed code.
