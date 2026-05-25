# Architecture

## Overview
The system is a browser-based React/Next.js application that talks directly to Supabase using the `@supabase/supabase-js` client. Public ISBN/book APIs are called from the frontend. Optional Supabase Edge Functions encapsulate any logic that must be server-side.

## Components
- **Client UI**
  - React or Next.js SPA/MPA
  - Supabase client for auth and database
  - Fetches external ISBN metadata
- **Supabase**
  - Postgres database (books, tags, users, relationships)
  - Auth (email-based)
  - Row Level Security policies
  - Optional Edge Functions for:
    - Complex auto-tagging
    - Secure operations
- **External services**
  - Open Library API
  - Google Books API

## Data flow
1. Teacher logs in via Supabase Auth.
2. Teacher enters/scans ISBN in the UI.
3. UI calls external ISBN APIs and shows metadata.
4. Teacher confirms and saves; UI writes to Supabase via PostgREST through `supabase-js`.
5. UI reads book list and tags from Supabase with RLS enforcing access.
