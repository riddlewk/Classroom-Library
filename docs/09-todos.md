# Current Todos (session)

This document persists the session-tracked todos into the repository documentation.

Generated: 2026-06-06T05:19:46Z

| ID | Title | Description | Status | Created At |
| --- | --- | --- | --- | --- |
| adding-password-signin | Adding password sign-in | Implement supabase.auth.signInWithPassword in Auth.tsx with error handling and state updates | done | 2026-06-06 04:11:57 |
| updating-auth-ui | Updating Auth UI | Add password input, toggle/buttons to pick magic-link vs password sign-in, and client-side validation | done | 2026-06-06 04:11:57 |
| creating-auth-tests | Adding unit tests | Write vitest unit tests for Auth component covering both sign-in methods | done | 2026-06-06 04:11:57 |
| adding-e2e-playwright | Adding E2E tests | Add Playwright tests to sign in programmatically and verify books UI | done | 2026-06-06 04:11:57 |
| documenting-signin-options | Documenting sign-in options | Update README and developer docs about password sign-in and creating password users | done | 2026-06-06 04:11:57 |
| adding-forgot-password | Adding Forgot Password | Add Forgot Password link in Auth and send reset email via Supabase client | done | 2026-06-06 04:15:15 |
| reset-password-page | Reset password page | Create /reset-password page to handle password-reset links and allow setting a new password | done | 2026-06-06 04:15:15 |
| adding-forgot-password-tests | Forgot password tests | Add unit and E2E tests for the password-reset flow | done | 2026-06-06 04:15:15 |
| fix-magic-link-redirect | Fix magic-link redirect behaviour | Prefer NEXT_PUBLIC_APP_URL for email redirects; update Auth.tsx and docs; add guidance for local testing using tunneling tools | pending | 2026-06-06 05:13:49 |
| add-tags-ui | Add tags UI on books page | Implement tag display, add and remove tag links for books; allow creating new tags and linking them to books | pending | 2026-06-06 05:13:49 |
| add-field-labels | Add labels to book form fields | Add label elements and ids to NewBookForm and books editing UI for accessibility | pending | 2026-06-06 05:13:49 |
| add-book-detail-form | Add book detail form and edit flow | Render books in grid; clicking title/ISBN opens a detail form/modal to edit all attributes and save | pending | 2026-06-06 05:16:28 |
| add-tags-crud | Add tags management CRUD page | Create /tags page with list, create, edit, delete operations and ensure book_tag associations are handled | pending | 2026-06-06 05:18:06 |

Notes:
- These todos are tracked in the session database and mirrored here for visibility.
- Mark completed todos as done in the session DB and update this file when work progresses.
