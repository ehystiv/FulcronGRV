import { expect, test } from '@playwright/test'

test.describe('phone menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The menu button only exists on small screens')

  test('opens, navigates and closes', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: 'Apri il menu' })
    await button.click()
    const menu = page.getByRole('navigation', { name: 'Menu principale' })
    await expect(menu).toBeVisible()

    await menu.getByRole('link', { name: 'Chi siamo' }).click()
    await expect(page).toHaveURL('/chi-siamo')
    await expect(menu).toBeHidden()
  })

  test('closes with Escape and gives focus back to the button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Apri il menu' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Menu principale' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Apri il menu' })).toBeFocused()
  })
})

test('desktop navigation marks the current section', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop navigation is hidden on small screens')
  await page.goto('/sinfonia/regolamento')
  const nav = page.getByRole('navigation', { name: 'Navigazione principale' })
  await expect(nav.getByRole('link', { name: 'La Sinfonia dei Sette' })).toHaveAttribute('aria-current', 'page')
})

test('wiki: breadcrumbs and menu lead to other pages', async ({ page, isMobile }) => {
  await page.goto('/wiki/geopolitica/est/partaros/l-ordine-dei-guaritori')
  const crumbs = page.getByRole('navigation', { name: 'Percorso' })
  await expect(crumbs.getByRole('link', { name: 'Wiki di Fulcron' })).toBeVisible()

  if (isMobile) await page.getByText('Esplora la wiki').click()
  await page.getByRole('link', { name: 'Storia' }).first().click()
  await expect(page).toHaveURL('/wiki/storia')
  await expect(page.locator('h1')).toBeVisible()
})

test('gallery: an album opens its photos in the viewer', async ({ page }) => {
  await page.goto('/gallery')
  await page.locator('a[href^="/gallery/"]').first().click()
  await expect(page).toHaveURL(/\/gallery\/.+/)

  await page.getByRole('link', { name: /Apri la foto 1 di/ }).click()
  const viewer = page.locator('.pswp')
  await expect(viewer).toBeVisible()
  // PhotoSwipe ignores close() during its opening animation and marks it nowhere in the DOM:
  // press Escape until the viewer goes away
  await expect(async () => {
    await page.keyboard.press('Escape')
    await expect(viewer).toHaveCount(0, { timeout: 1000 })
  }).toPass({ timeout: 10_000 })
})

test('wiki search: finds pages ignoring accents and opens the chosen one', async ({ page }) => {
  await page.goto('/wiki')
  const box = page.getByRole('combobox', { name: 'Cerca nella wiki' })
  await box.fill('nobilta')
  const first = page.getByRole('option').first()
  await expect(first).toContainText('La nobiltà del Nord')
  await box.press('Enter')
  await expect(page).toHaveURL('/wiki/geopolitica/nord/nobilta-nord')
  // The page transition swaps the whole wiki page, search box included
  await expect(page.locator('h1')).toHaveText('La nobiltà del Nord')

  await box.fill('parolachenonesiste')
  // Shown in the list and announced to screen readers
  await expect(page.getByText('Nessun risultato').last()).toBeVisible()
  await expect(page.locator('[aria-live="polite"]')).toHaveText('Nessun risultato')
  await box.press('Escape')
  await expect(page.getByRole('option')).toHaveCount(0)
})

test('wiki map: a place found with the search opens its card, and the address remembers it', async ({ page }) => {
  await page.goto('/wiki/mappa')
  const search = page.getByRole('combobox', { name: 'Cerca un luogo sulla mappa' })
  // Accents are ignored, the painted name finds the wiki one
  await search.fill('utelan')
  await expect(page.getByRole('option', { name: /Estar/ })).toBeVisible()
  await search.fill('partaros')
  await search.press('Enter')

  const card = page.getByRole('complementary')
  await expect(card.getByRole('heading', { name: 'Partaros' })).toBeVisible()
  await expect(card.getByText('Posizione indicativa')).toBeVisible()
  await expect(page).toHaveURL(/\?luogo=partaros$/)

  // A shared link opens on the same card
  await page.goto('/wiki/mappa?luogo=valdyris')
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Valdyris' })).toBeVisible()
  await page.getByRole('complementary').getByRole('link', { name: 'Leggi nella wiki' }).click()
  await expect(page).toHaveURL('/wiki/geopolitica/ovest/valdyris')
})

test('wiki map: tapping a place on the map opens its card', async ({ page }) => {
  await page.goto('/wiki/mappa')
  // Amhora is shown from the first view; wait for the browser-drawn terrain, then tap its symbol
  await page.locator('.mappa use[href="#m-latifoglia"]').first().waitFor({ state: 'attached' })
  await page.locator('[data-luogo="amhora"]').click()
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Amhora' })).toBeVisible()
  await page.getByRole('button', { name: 'Chiudi la scheda' }).click()
  await expect(page.getByRole('complementary')).toBeHidden()
  await expect(page).toHaveURL('/wiki/mappa')
})
