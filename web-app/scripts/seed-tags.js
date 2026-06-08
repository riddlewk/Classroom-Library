/*
Seed tags and attach them to books for a given OWNER_USER_ID.
Usage:
  NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... OWNER_USER_ID=... node scripts/seed-tags.js
*/

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OWNER = process.env.OWNER_USER_ID

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !OWNER) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and OWNER_USER_ID must be set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function run() {
  const tagNames = ['Children', 'Fiction', 'Classic', 'Picture Book']
  console.log('Ensuring tags exist for owner', OWNER)

  // fetch existing tags by name
  const { data: existingTags = [], error: selErr } = await supabase.from('tags').select('*').in('name', tagNames).eq('owner_user_id', OWNER)
  if (selErr) throw selErr
  const existingNames = new Set(existingTags.map(t => t.name))
  const toInsert = tagNames.filter(n => !existingNames.has(n)).map(n => ({ name: n, owner_user_id: OWNER }))

  if (toInsert.length) {
    const { data: insertedTags, error: insErr } = await supabase.from('tags').insert(toInsert).select()
    if (insErr) throw insErr
    console.log('Inserted tags:', insertedTags.map(t => t.name))
  } else {
    console.log('All tags already exist.')
  }

  // reload tags
  const { data: allTags = [], error: allErr } = await supabase.from('tags').select('*').in('name', tagNames).eq('owner_user_id', OWNER)
  if (allErr) throw allErr
  const tagByName = Object.fromEntries(allTags.map(t => [t.name, t]))

  // fetch books for owner
  const { data: books = [], error: bookErr } = await supabase.from('books').select('*').eq('owner_user_id', OWNER)
  if (bookErr) throw bookErr
  if (!books.length) {
    console.log('No books found for owner', OWNER)
    return
  }
  const bookByIsbn = Object.fromEntries(books.map(b => [b.isbn, b]))

  // mappings (adjusted for seeded books)
  const mappings = [
    { isbn: '9780064400558', tags: ['Children', 'Classic'] },
    { isbn: '9780399226908', tags: ['Children', 'Picture Book'] },
    { isbn: '9780140328721', tags: ['Children', 'Fiction', 'Classic'] },
  ]

  const toCreate = []
  for (const m of mappings) {
    const book = bookByIsbn[m.isbn]
    if (!book) {
      console.warn('Book not found for ISBN', m.isbn)
      continue
    }
    for (const tn of m.tags) {
      const tag = tagByName[tn]
      if (!tag) {
        console.warn('Tag not found (unexpected):', tn)
        continue
      }
      toCreate.push({ book_id: book.id, tag_id: tag.id })
    }
  }

  if (!toCreate.length) {
    console.log('No book-tag mappings to create.')
    return
  }

  // avoid inserting duplicates: check existing mappings
  const { data: existingMappings = [], error: mapErr } = await supabase.from('book_tags').select('*').in('book_id', toCreate.map(x => x.book_id))
  if (mapErr) throw mapErr
  const exists = new Set(existingMappings.map(m => `${m.book_id}:${m.tag_id}`))
  const finalInserts = toCreate.filter(x => !exists.has(`${x.book_id}:${x.tag_id}`))

  if (finalInserts.length) {
    const { data: created, error: createErr } = await supabase.from('book_tags').insert(finalInserts).select()
    if (createErr) throw createErr
    console.log('Created book_tags rows:', created.length)
  } else {
    console.log('All requested book-tag mappings already exist.')
  }

  console.log('Done.')
}

run().catch(err => {
  console.error('Error:', err.message || err)
  process.exit(1)
})
