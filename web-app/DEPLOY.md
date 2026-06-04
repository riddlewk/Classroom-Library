Deployment to Vercel (recommended)

1. Create a new project on https://vercel.com and import this repository (riddlewk/Classroom-Library).
2. Set framework preset to Next.js.
3. Add environment variables in Project Settings → Environment Variables (Production & Preview & Development):
   - NEXT_PUBLIC_SUPABASE_URL: https://your-project.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: <anon-key>
   - SUPABASE_SERVICE_ROLE_KEY (optional, only for server-side scripts)
4. Set build command: npm run build
   Set output directory: (default Next.js)
5. Deploy. After deployment, verify site at the Vercel URL.

Notes:
- Do NOT commit service role keys to the repo. Use Vercel secrets or project env vars.
- If using server-side functions that need elevated privileges, store SUPABASE_SERVICE_ROLE_KEY as a secret and reference it only in serverless functions.
- For preview testing, create demo users in Supabase Auth and run the seed script with the service role key against a development database.
