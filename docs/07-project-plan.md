# Project plan

## Phase 1: Foundations
- Set up GitHub repo.
- Create Supabase project and database schema.
- Configure RLS for single-owner data.
- Scaffold React/Next.js app and Supabase client.

## Phase 2: Core features
- Implement auth (sign up, sign in, sign out).
- Implement ISBN entry + external API lookup.
- Implement book create with auto-suggested tags.
- Implement book list, detail view, and edit.

## Phase 3: Tagging and UX polish
- Tag management screens.
- Search and filter by tags, title, author.
- Status field (available, checked out, etc.).
- Responsive layout for iPad.

## Phase 4: Hardening and extras
- Error handling for failed ISBN lookups.
- Basic analytics (book counts by tag, status).
- Optional: Edge Function for more advanced auto-tagging.
