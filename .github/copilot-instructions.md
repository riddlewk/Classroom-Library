# Copilot Instructions for Classroom Library

## Project Overview

A Next.js web application for managing classroom book libraries. Teachers can add books via ISBN lookup, organize them with tags, and track availability status. The frontend talks directly to Supabase (PostgreSQL + Auth) with optional server-side logic via Edge Functions.

## Build & Development

All commands run from `/web-app`:

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Development server (port 3000) | `npm run dev` |
| Production build | `npm build` |
| Start production server | `npm start` |
| Lint | `npm run lint` |

**Environment Setup**: Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5, Tailwind CSS 3.4
- **Backend**: Supabase (PostgreSQL + PostgREST API + Auth)
- **External APIs**: Open Library, Google Books (for ISBN lookups)
- **Client Library**: @supabase/supabase-js v2

## Architecture & Data Flow

### High-Level Architecture
1. **Client (Next.js/React)**
   - Manages UI state with Supabase Auth
   - Makes direct API calls to Supabase PostgREST
   - Fetches ISBN metadata from public APIs
   
2. **Supabase Backend**
   - PostgreSQL database with Row Level Security (RLS)
   - Auth enforces user isolation (owner_user_id = auth.uid())
   - Optional Edge Functions for complex server-side operations

3. **External Services**
   - Open Library API (book metadata)
   - Google Books API (book metadata)

### Data Model (Postgres/Supabase)

| Table | Columns | Notes |
|-------|---------|-------|
| `books` | id, owner_user_id (fk), isbn, title, authors[], description, subjects[], reading_level, status (enum: available/checked_out/lost/damaged), cover_url, created_at, updated_at | Unique isbn per owner; indexed for fast lookups |
| `tags` | id, owner_user_id (fk), name, description, created_at | Unique name per owner |
| `book_tags` | book_id (fk), tag_id (fk) | Join table; enforces ownership via RLS on both sides |

**Security**: All tables enforce `owner_user_id = auth.uid()` via RLS policies.

### Data Flow
1. Teacher logs in via Supabase Auth
2. Enters/scans ISBN in UI → calls external ISBN APIs → displays metadata preview
3. Confirms and saves → UI writes via `supabase-js` client (PostgREST)
4. UI reads books/tags → Supabase RLS enforces owner isolation

## Key Conventions & Patterns

### File Structure
```
web-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with header/nav
│   ├── page.tsx            # Home page
│   ├── books/              # Books list page
│   ├── isbn/               # ISBN scanner/lookup page
│   ├── profile/            # User profile page
│   └── globals.css         # Global Tailwind styles
├── components/             # Reusable React components
│   ├── Auth.tsx            # Login/logout UI
│   └── ProfileClient.tsx   # Client-side profile component
├── lib/
│   └── supabaseClient.ts   # Singleton Supabase client
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript config (strict mode enabled)
```

### Supabase Client Usage
Use the singleton exported from `lib/supabaseClient.ts`:
```typescript
import { supabase } from '@/lib/supabaseClient'

// Examples:
const { data, error } = await supabase.from('books').select()
const { data: { user } } = await supabase.auth.getUser()
```

### Styling & UI
- **Framework**: Tailwind CSS (utility-first)
- **Design System**: Minimal; uses semantic HTML with Tailwind classes
- **Global Styles**: `app/globals.css`
- **Responsive**: Mobile-first approach via Tailwind breakpoints

### TypeScript
- Strict mode enabled (`strict: true`)
- Use `React.ReactNode` for children props
- Metadata and page exports use Next.js types
- No explicit React imports needed (auto jsx transform)

### Component Patterns
- Functional components with hooks
- Client components use `'use client'` directive (App Router)
- Keep components focused; extract reusable logic to lib utilities
- Auth state managed via `supabase.auth.onAuthStateChange()` in Auth component

### Environment Variables
- **Public vars**: Prefix with `NEXT_PUBLIC_` (exposed to client)
- **Secret vars**: Server-only (not prefixed)
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Store in `.env.local` (git-ignored)

## Common Tasks

### Adding a New Page
1. Create directory in `app/` (e.g., `app/newpage/`)
2. Add `page.tsx` with default export
3. Add navigation link in `app/layout.tsx`
4. Use Supabase client for data fetching

### Working with Books Data
- Always query via `supabase.from('books').select()`
- Filter by owner: included automatically via RLS (no manual WHERE needed)
- Status enum: validate against `available | checked_out | lost | damaged`

### Accessing User Identity
```typescript
const { data: { user } } = await supabase.auth.getUser()
const userId = user?.id  // Use for filtering queries
```

### Fetching External ISBN Data
Call Open Library or Google Books APIs from the client; results shown in preview before save.
No backend wrapper needed unless caching or rate-limiting required.

## Testing & Linting

- **Linting**: `npm run lint` (Next.js ESLint config)
- **Tests**: Not yet configured; add Jest or Vitest if needed
- **Type Checking**: `tsc --noEmit` (included in build process)

## MCP Servers (Optional but Recommended)

MCP servers extend Copilot's capabilities. Configure any/all of these for enhanced development:

### Supabase MCP
**Purpose**: Inspect database schema, validate migrations, query RLS policies  
**Setup**:
1. Get your Supabase credentials from the project settings:
   - Project URL (looks like `https://xxxx.supabase.co`)
   - Service Role Key (Dashboard → Settings → API → Service role key)
2. Configure in your MCP client (VS Code Copilot, etc.):
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": ["@modelcontextprotocol/server-supabase"],
         "env": {
           "SUPABASE_URL": "https://your-project.supabase.co",
           "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
         }
       }
     }
   }
   ```
3. Use it to: Inspect `books`, `tags`, `book_tags` schemas; verify RLS policies

### Playwright MCP
**Purpose**: Write and run end-to-end tests for UI interactions  
**Setup**:
1. Install Playwright in web-app:
   ```bash
   cd web-app
   npm install --save-dev @playwright/test
   ```
2. Configure MCP:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["@modelcontextprotocol/server-playwright"],
         "env": {
           "PLAYWRIGHT_BROWSERS_PATH": "0"
         }
       }
     }
   }
   ```
3. Use it to: Test ISBN scanner form, auth login/logout, book CRUD operations

### PostgreSQL MCP
**Purpose**: Direct SQL queries for debugging and data manipulation  
**Setup**:
1. Get your Supabase PostgreSQL connection string:
   - Dashboard → Settings → Database → Connection pooling (use this, not direct)
   - Connection string format: `postgresql://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres`
2. Configure MCP:
   ```json
   {
     "mcpServers": {
       "postgres": {
         "command": "npx",
         "args": ["@modelcontextprotocol/server-postgres"],
         "env": {
           "POSTGRES_CONNECTION_STRING": "postgresql://user:password@host:port/database"
         }
       }
     }
   }
   ```
3. Use it to: Write seed scripts, test RLS policies, debug data issues

**Note**: Keep service role keys and connection strings secure. Store in `.env` or credential manager, never commit to git.

## Notes

- No tests currently configured; use Jest or Vitest if adding unit tests, or Playwright for E2E
- RLS policies must be configured in Supabase dashboard (not in code)
- Edge Functions optional; keep logic client-side unless auth/security requires server execution
- ISBN lookup includes author array; parse carefully (format varies by API)
