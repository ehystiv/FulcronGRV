import { expect, test } from '@playwright/test'

// The main pages: they answer 200, have one h1 and run without JavaScript errors
const PAGES = [
  '/',
  '/chi-siamo',
  '/inizia-a-giocare',
  '/sinfonia',
  '/sinfonia/ambientazione',
  '/sinfonia/regolamento',
  '/sinfonia/eventi',
  '/oneshot',
  '/oneshot/palazzo-destini',
  '/oneshot/sunless-dawn',
  '/oneshot/teoria-del-nulla',
  '/gallery',
  '/wiki',
  '/privacy',
]

for (const path of PAGES) {
  test(`${path} loads`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('an unknown address is a real 404 with a way back', async ({ page }) => {
  const response = await page.goto('/questa-pagina-non-esiste')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('non porta da nessuna parte')
  await page.getByRole('link', { name: 'Torna alla home' }).click()
  await expect(page).toHaveURL('/')
})

test('a missing wiki page offers the way back to the wiki', async ({ page }) => {
  const response = await page.goto('/wiki/pagina-inventata')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Torna alla wiki' })).toBeVisible()
})

test('the sitemap lists the pages', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.ok()).toBe(true)
  const xml = await response.text()
  expect(xml).toContain('<loc>https://fulcrongrv.it/sinfonia/regolamento</loc>')
  expect(xml).toContain('<loc>https://fulcrongrv.it/wiki/storia</loc>')
})
