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

```
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon..."
```

4. Run the development server:

```bash
npm run dev
```

Files of interest

- App root and pages: [web-app/app](app)
- Supabase client: [web-app/lib/supabaseClient.ts](lib/supabaseClient.ts)
