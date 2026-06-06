# Classroom Library — Web App (Next.js)

This folder contains a minimal Next.js 14 app scaffold with Tailwind and a Supabase client setup.

Quick start

1. Change into the web app directory:

```bash
cd web-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` with your Supabase credentials:

Create a `.env.local` with your Supabase credentials. Never commit this file or paste your keys into public places.

Example `.env.local` contents (replace with your values):

```
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

You can create this file locally and add it to `.gitignore` to avoid accidental commits.

4. Run the development server:

```bash
npm run dev
```

Files of interest

- App root and pages: [web-app/app](app)
- Supabase client: [web-app/lib/supabaseClient.ts](lib/supabaseClient.ts)
- Example env: [web-app/.env.local.example](.env.local.example)

Authentication

- Supports magic-link (email) and password sign-in.
- UI: web-app/components/Auth.tsx — users can toggle "Use password" to sign in with email+password or request a magic link.
- Forgot password: triggers Supabase reset email and completes at /reset-password (web-app/app/reset-password/page.tsx).
- Notes: demo users created by web-app/scripts/create-demo-users.js have passwords; magic-link-only users won't have passwords unless set.

Testing

- Unit tests: Vitest (npm run test or npm run test:unit).
- E2E: Playwright tests in web-app/tests/e2e — run locally with `npm run dev` and `npx playwright test --project=chromium`.
- Playwright helper: scripts/capture-books-playwright.js demonstrates programmatic checks and screenshots.

Scripts

- Seed books: `npm run seed` (uses web-app/scripts/seed.js) — requires SUPABASE_SERVICE_ROLE_KEY and OWNER_USER_ID env vars.
- Create demo users: node scripts/create-demo-users.js (service role key required).
- Seed tags and map books: scripts/seed-tags.js.
- ETA wrapper: scripts/timed-run.sh — prints ETA/elapsed for long-running commands; used by CI.

CI

- GitHub Actions workflow: .github/workflows/ci.yml
- Runs lint, unit tests, build, and Playwright E2E. Requires repo secrets:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (for E2E seeding/setup if used)

Security

- Never commit service role keys or anon keys. Use repository secrets for CI.
- Revoke or rotate service keys when finished testing.

Contributing

- Follow existing patterns: client uses the supabase singleton at web-app/lib/supabaseClient.ts.
- Add tests for new auth flows and update Playwright E2E when changing UI.

