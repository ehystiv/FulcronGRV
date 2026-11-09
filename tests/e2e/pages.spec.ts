import { expect, test, type Locator } from '@playwright/test'

// The main pages: they answer 200, have one h1, a share preview with an absolute image URL,
// and run without JavaScript errors
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
  '/wiki/mappa',
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
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//)
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

// Start the game, trying again until the page has hydrated and the game listens: a key pressed earlier is lost
async function avvia(game: Locator, isMobile: boolean) {
  await expect(async () => {
    if (isMobile) await game.tap()
    else await game.page().keyboard.press('Space')
    await expect(game).not.toContainText('Premi Spazio', { timeout: 500 })
  }).toPass({ timeout: 10_000 })
}

test('the 404 page hides a game: Illyrio runs from the Barghest', async ({ page, isMobile }) => {
  // Some browsers give the first frame a timestamp a little before performance.now(): the game must not go back in time
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window)
    window.requestAnimationFrame = (cb) => raf((t) => cb(t - 30))
  })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/questa-pagina-non-esiste')
  const game = page.getByRole('application', { name: /Illyrio in fuga dal Barghest/ })
  await expect(game).toContainText('Premi Spazio')
  const prima = (await game.boundingBox())!.width
  await avvia(game, isMobile)
  // The game is on: the hint goes away and the steps start counting
  await expect(game).not.toContainText('Premi Spazio')
  await expect(game).not.toContainText('00000')
  await expect(game).not.toContainText('-')
  // ...and the desert widens to make room for the run
  await expect.poll(async () => (await game.boundingBox())!.width).toBeGreaterThan(prima + 20)
  expect(errors).toEqual([])
})

test('at the current year + 1000 steps a warrior comes to the rescue and slays the Barghest', async ({
  page,
  isMobile,
}) => {
  // Pretend it is the year -990, so the goal is 10 steps away instead of a couple of minutes of play
  await page.addInitScript(() => {
    Date.prototype.getFullYear = () => -990
  })
  await page.goto('/questa-pagina-non-esiste')
  const game = page.getByRole('application', { name: /Illyrio in fuga dal Barghest/ })
  await avvia(game, isMobile)
  await expect(game.getByText('Ho capito, Magistro Illyrio!')).toBeVisible()
  await expect(game).toContainText('Il Barghest è stato sconfitto!', { timeout: 10_000 })
  await expect(game.getByText('Ho capito, Magistro Illyrio!')).toBeHidden()
  await expect(game).toContainText('00010')
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
  expect(xml).toContain('<loc>https://fulcrongrv.it/sinfonia</loc>')
  expect(xml).toMatch(/<loc>https:\/\/fulcrongrv\.it\/wiki\/storia<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
  // Error pages and redirects stay out
  expect(xml).not.toContain('404')
  expect(xml).not.toContain('/who<')
})

test('the rulebook links each manual in both versions on the documents bucket', async ({ page }) => {
  await page.goto('/sinfonia/regolamento')
  const read = page.getByRole('link', { name: /^Leggi / })
  const print = page.getByRole('link', { name: /da stampare/ })
  await expect(read).toHaveCount(3)
  await expect(print).toHaveCount(3)
  for (const link of [...(await read.all()), ...(await print.all())]) {
    await expect(link).toHaveAttribute('href', /^https:\/\/documenti\.fulcrongrv\.it\/\w+\.pdf$/)
  }
})
