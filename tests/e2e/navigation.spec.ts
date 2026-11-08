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
  // Penthos, on the painted map, is Partaros
  await search.fill('penthos')
  await search.press('Enter')

  const card = page.getByRole('complementary')
  await expect(card.getByRole('heading', { name: 'Partaros' })).toBeVisible()
  await expect(card.getByText('Sulla mappa dipinta: Penthos')).toBeVisible()
  await expect(page).toHaveURL(/\?luogo=partaros$/)

  // Places the painted map does not show say so
  await search.fill('bontor')
  await search.press('Enter')
  await expect(card.getByText('Posizione indicativa')).toBeVisible()

  // A shared link opens on the same card
  await page.goto('/wiki/mappa?luogo=valdyris')
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Valdyris' })).toBeVisible()
  await page.getByRole('complementary').getByRole('link', { name: 'Leggi nella wiki' }).click()
  await expect(page).toHaveURL('/wiki/geopolitica/ovest/valdyris')
})

test('wiki map: tapping a place on the map opens its card', async ({ page }) => {
  await page.goto('/wiki/mappa')
  // Amhora is shown from the first view; wait for the browser-drawn terrain, then tap its symbol
  await page.locator('.mappa use[href^="#m-latifoglia"]').first().waitFor({ state: 'attached' })
  await page.locator('[data-luogo="amhora"]').click()
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Amhora' })).toBeVisible()
  await page.getByRole('button', { name: 'Chiudi la scheda' }).click()
  await expect(page.getByRole('complementary')).toBeHidden()
  await expect(page).toHaveURL('/wiki/mappa')
})

test('wiki map: the 3D view opens, names a place and gives way back to the flat map', async ({ page }) => {
  await page.goto('/wiki/mappa')
  await page.getByRole('button', { name: 'Vedi l’Anello in rilievo, in 3D' }).click()
  await expect(page).toHaveURL(/vista=3d/)
  await expect(page.locator('.rilievo canvas')).toBeVisible()
  // The names float over the model and open the same card as on the flat map
  await page.getByRole('group', { name: 'Luoghi principali' }).getByRole('button', { name: 'Valdyris' }).click()
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Valdyris' })).toBeVisible()

  await page.getByRole('button', { name: 'Torna alla mappa piatta' }).click()
  await expect(page.locator('.rilievo')).toHaveCount(0)
  await expect(page).toHaveURL('/wiki/mappa?luogo=valdyris')
})

test('wiki map: the layers panel stays inside the map and every option can be reached', async ({ page }) => {
  await page.goto('/wiki/mappa')
  await page.getByRole('button', { name: 'Livelli e legenda' }).click()
  const panel = await page.locator('#mappa-livelli').boundingBox()
  const map = await page.getByRole('region', { name: 'Mappa interattiva' }).boundingBox()
  expect(panel!.y).toBeGreaterThanOrEqual(map!.y)
  expect(panel!.y + panel!.height).toBeLessThanOrEqual(map!.y + map!.height)

  const settlements = page.getByLabel('Città e luoghi')
  await settlements.click()
  await expect(settlements).not.toBeChecked()
  await expect(page.locator('[data-luogo="amhora"]')).toBeHidden()
})

test('wiki map: full screen covers the window and gives the page back', async ({ page }) => {
  await page.goto('/wiki/mappa')
  const map = page.getByRole('region', { name: 'Mappa interattiva' })
  await page.getByRole('button', { name: 'Schermo intero' }).click()
  const viewport = page.viewportSize()!
  await expect(async () => {
    const box = await map.boundingBox()
    expect(Math.round(box!.y)).toBe(0)
    expect(Math.round(box!.height)).toBeGreaterThanOrEqual(viewport.height - 1)
  }).toPass()
  // The map still works in full screen
  await page.locator('[data-luogo="amhora"]').click()
  await expect(page.getByRole('complementary').getByRole('heading', { name: 'Amhora' })).toBeVisible()

  await page.getByRole('button', { name: 'Esci dallo schermo intero' }).click()
  await expect(async () => expect(Math.round((await map.boundingBox())!.y)).toBeGreaterThan(0)).toPass()
})
