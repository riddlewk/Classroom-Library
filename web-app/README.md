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
