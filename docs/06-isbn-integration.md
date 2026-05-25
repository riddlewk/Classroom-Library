# ISBN integration

## External APIs
- Open Library: `https://openlibrary.org/isbn/{ISBN}.json`
- Google Books: `https://www.googleapis.com/books/v1/volumes?q=isbn:{ISBN}`

## Lookup flow
1. User enters ISBN and submits.
2. UI normalizes ISBN (strip hyphens, validate length).
3. UI calls Open Library; if not found, falls back to Google Books.
4. Extract:
   - Title
   - Authors
   - Description
   - Subjects / categories
   - Cover image URL
5. Map subjects/categories to suggested tags using a simple ruleset.

## Auto-tag rules (initial)
- If subject contains “juvenile fiction” → tags: `Fiction`, `Elementary`.
- If subject contains “history” → tag: `History`.
- If subject contains “science” → tag: `Science`.
- (Extendable via config or Edge Function.)
