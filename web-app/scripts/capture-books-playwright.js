const { chromium } = require('playwright')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const USER_ID = process.env.DEMO_USER_ID || process.env.OWNER_USER_ID

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !USER_ID) {
  console.error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DEMO_USER_ID/OWNER_USER_ID must be set')
  process.exit(1)
}

;(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/books', { waitUntil: 'networkidle' })

  // Fetch books using supabase-js (server-side)
  const { data: books, error } = await supabase
    .from('books')
    .select('id,title,authors,cover_url,status,owner_user_id')
    .eq('owner_user_id', USER_ID)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch books from Supabase:', error.message || error)
    await browser.close()
    process.exit(1)
  }

  // Inject a simple UI replacement showing fetched books
  await page.evaluate((books) => {
    const main = document.querySelector('main')
    if (!main) return
    const d = document.createElement('div')
    d.innerHTML = '<h2 class="text-xl font-semibold">Books (injected)</h2>' + books
      .map(b => `<div style="border-bottom:1px solid #eee;padding:8px 0"><h3 style="margin:0">${b.title}</h3><div style="font-size:12px;color:#666">${(b.authors||[]).join(', ')}</div></div>`)
      .join('')
    main.innerHTML = ''
    main.appendChild(d)
  }, books || [])

  const out = '/tmp/books-injected.png'
  await page.screenshot({ path: out, fullPage: true })
  console.log('Screenshot saved to', out)
  await browser.close()
})().catch(err => {
  console.error(err)
  process.exit(1)
})
