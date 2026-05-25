# Data model (Supabase / Postgres)

## Tables

### books
- id (uuid, pk)
- owner_user_id (uuid, fk -> auth.users.id)
- isbn (text, indexed, unique per owner)
- title (text)
- authors (text[])
- description (text)
- subjects (text[])
- reading_level (text)
- status (text, enum: ‘available’, ‘checked_out’, ‘lost’, ‘damaged’)
- cover_url (text)
- created_at (timestamptz, default now())
- updated_at (timestamptz)

### tags
- id (uuid, pk)
- owner_user_id (uuid, fk -> auth.users.id)
- name (text, unique per owner)
- description (text)
- created_at (timestamptz)

### book_tags
- book_id (uuid, fk -> books.id)
- tag_id (uuid, fk -> tags.id)
- primary key (book_id, tag_id)

## RLS (high-level)
- books: owner_user_id = auth.uid()
- tags: owner_user_id = auth.uid()
- book_tags: join constrained by books and tags policies.
