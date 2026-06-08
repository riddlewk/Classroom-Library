const { test, expect } = require('@playwright/test')

const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo1@example.com'
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Password123'

test('password sign-in displays books', async ({ page }) => {
  await page.goto('http://localhost:3000/books')
  await page.fill('input[placeholder="you@school.edu"]', DEMO_EMAIL)
  // password input may have placeholder 'Optional password'
  await page.fill('input[placeholder="Optional password"]', DEMO_PASSWORD)
  await page.check('input[type=checkbox]')
  await page.click('text=Sign in')

  // Wait for a book title to appear
  await expect(page.locator("text=Charlotte's Web")).toBeVisible({ timeout: 5000 })
  // take screenshot
  await page.screenshot({ path: '/tmp/playwright-books.png', fullPage: true })
})
