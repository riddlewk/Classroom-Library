# Nonfunctional requirements

## NFR-1: Platform and access
- NFR-1.1 App must run in a modern browser (including Safari on iPad).
- NFR-1.2 Development workflow must be usable from an iPad via GitHub (e.g., Codespaces).

## NFR-2: Performance
- NFR-2.1 Initial book list load under 2 seconds for up to 1,000 books.
- NFR-2.2 ISBN lookup response under 3 seconds (network permitting).

## NFR-3: Security
- NFR-3.1 Use Supabase Row Level Security (RLS) to ensure each teacher only sees their own data (if multi-tenant).
- NFR-3.2 Do not expose any private API keys in client code; use Edge Functions if needed.

## NFR-4: Maintainability
- NFR-4.1 Codebase organized into clear modules: data access, UI components, ISBN services.
- NFR-4.2 All major features documented in `docs/` as Markdown.

## NFR-5: Cost
- NFR-5.1 Stay within Supabase free tier for typical classroom usage.
