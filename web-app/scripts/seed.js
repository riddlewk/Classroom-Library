/*
Seed script for Classroom Library
Usage:
  SUPABASE_URL=https://... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=your-service-role-key OWNER_USER_ID=the-user-id node scripts/seed.js

This script requires an existing user id (OWNER_USER_ID) to attach seeded books to. Create a demo user via the Supabase dashboard (Auth → Users) and copy the id.
*/

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OWNER = process.env.OWNER_USER_ID

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment')
  process.exit(1)
}
if (!OWNER) {
  console.error('ERROR: OWNER_USER_ID must be set to an existing Supabase user id (see Supabase Auth → Users)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function run() {
  const books = [
    { title: "Charlotte's Web", authors: ["E. B. White"], isbn: '9780064400558', cover_url: null, status: 'available', owner_user_id: OWNER },
    { title: 'The Very Hungry Caterpillar', authors: ['Eric Carle'], isbn: '9780399226908', cover_url: null, status: 'available', owner_user_id: OWNER },
    { title: 'Matilda', authors: ['Roald Dahl'], isbn: '9780140328721', cover_url: null, status: 'available', owner_user_id: OWNER },
  ]

  console.log('Inserting', books.length, 'books for user', OWNER)
  const { data, error } = await supabase.from('books').insert(books).select()
  if (error) {
    console.error('Insert error:', error.message || error)
    process.exit(1)
  }
  console.log('Inserted rows:', data.length)
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
