# Functional requirements

## FR-1: Authentication
- FR-1.1 Teachers can sign up, sign in, and sign out using Supabase Auth (email/password or magic link).
- FR-1.2 Only authenticated teachers can create, update, or delete books and tags.

## FR-2: ISBN capture and lookup
- FR-2.1 Teacher can enter ISBN via:
  - Barcode scanner (keyboard wedge)
  - Manual typing
- FR-2.2 On ISBN submission, the app calls:
  - Open Library API
  - Google Books API
- FR-2.3 The app displays fetched metadata (title, authors, description, subjects, cover).

## FR-3: Auto-tagging
- FR-3.1 The system generates suggested tags based on:
  - Subjects/categories from external APIs
  - Simple keyword rules (e.g., “juvenile fiction” → “Fiction”, “Elementary”).
- FR-3.2 Teacher can accept, remove, or add custom tags before saving.

## FR-4: Book management (CRUD)
- FR-4.1 Create: Save a new book record with ISBN, metadata, and tags to Supabase.
- FR-4.2 Read: List all books with search and filters (title, author, tags, reading level).
- FR-4.3 Update: Edit book details and tags.
- FR-4.4 Delete: Remove a book from the library.

## FR-5: Tag management
- FR-5.1 View all tags.
- FR-5.2 Create, rename, and delete tags.
- FR-5.3 See which books use a given tag.

## FR-6: Classroom-specific fields
- FR-6.1 Track status: available, checked out, lost, damaged.
- FR-6.2 (Later) Track simple checkout history per book.
