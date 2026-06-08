/*
Create demo users via Supabase admin API (requires service role key).
Usage:
  NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-demo-users.js
*/

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function run() {
  const users = [
    { email: 'demo1@example.com', password: 'Password123' },
    { email: 'demo2@example.com', password: 'Password123' },
    { email: 'demo3@example.com', password: 'Password123' },
  ]

  for (const u of users) {
    console.log('Creating user', u.email)
    try {
      const res = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { demo: true }
      })
      if (res.error) {
        console.error('Error creating', u.email, res.error.message || res.error)
      } else {
        console.log('Created user id:', res.data?.user?.id || res.data?.id || JSON.stringify(res.data))
      }
    } catch (err) {
      console.error('Exception creating', u.email, err.message || err)
    }
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
