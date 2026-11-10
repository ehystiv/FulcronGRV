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
  await page.goto('/wiki/fazioni/l-ordine-dei-guaritori')
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

test.describe('night mode', () => {
  const sfondo = (page: import('@playwright/test').Page) =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const NOTTE = 'rgb(11, 26, 33)'
  const GIORNO = 'rgb(247, 243, 234)'

  test('the site follows a dark system theme, with emerald accents', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/wiki/storia')
    expect(await sfondo(page)).toBe(NOTTE)
    await expect(page.getByRole('navigation', { name: 'Percorso' }).getByRole('link').first()).toHaveCSS(
      'color',
      'rgb(63, 224, 156)',
    )
    await page.goto('/chi-siamo')
    expect(await sfondo(page)).toBe(NOTTE)
    // The 404 page too
    await page.goto('/questa-pagina-non-esiste')
    expect(await sfondo(page)).toBe(NOTTE)
  })

  test('with a light system theme the site stays as it is by day', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/wiki/storia')
    expect(await sfondo(page)).toBe(GIORNO)
  })

  test('the page of a oneshot keeps its own look at night', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/oneshot')
    await expect(page.locator('html')).toHaveClass(/\bnotte\b/)
    await page.locator('a[href="/oneshot/sunless-dawn"]').first().click()
    await expect(page).toHaveURL('/oneshot/sunless-dawn')
    await expect(page.locator('html')).not.toHaveClass(/\bnotte\b/)
  })
})

test('wiki menu: a section opens with its arrow without leaving the page', async ({ page, isMobile }) => {
  await page.goto('/wiki/fazioni/la-setta')
  if (isMobile) await page.getByText('Esplora la wiki').click()
  const menu = page.getByRole('navigation', { name: 'Pagine della wiki' }).locator('visible=true')
  await expect(menu.getByRole('link', { name: 'La Setta' })).toHaveAttribute('aria-current', 'page')
  await expect(menu.getByRole('link', { name: "Guerra dell'Occhio" })).toHaveCount(0)
  await menu.getByRole('button', { name: 'Apri Storia' }).click()
  await expect(menu.getByRole('link', { name: "Guerra dell'Occhio" })).toBeVisible()
  await expect(page).toHaveURL('/wiki/fazioni/la-setta')
})

test('wiki pages moved into sections still answer at their old address', async ({ page }) => {
  await page.goto('/wiki/la-setta')
  await expect(page).toHaveURL('/wiki/fazioni/la-setta')
  await page.goto('/wiki/razze')
  await expect(page).toHaveURL('/wiki/popoli')
  await expect(page.locator('h1')).toHaveText('Popoli e Razze')
})

test('the Bacheca is always in the campaign tabs, with a pointer to Instagram while it is empty', async ({ page }) => {
  await page.goto('/sinfonia')
  await page.getByRole('link', { name: 'Bacheca', exact: true }).first().click()
  await expect(page).toHaveURL('/sinfonia/bacheca')
  await expect(page.locator('h1')).toHaveText('Bacheca')
  await expect(page.getByRole('link', { name: 'Instagram' }).first()).toBeVisible()
})

test.describe('glossary', () => {
  test('a word of the game shows its meaning on hover or tap', async ({ page, isMobile }) => {
    await page.goto('/inizia-a-giocare')
    const termine = page.getByRole('button', { name: 'Workshop' }).first()
    const bolla = page.getByRole('tooltip').filter({ hasText: 'L’incontro prima di ogni evento' }).first()
    await termine.scrollIntoViewIfNeeded()
    if (isMobile) {
      // Retry until the page has hydrated: a tap before that does nothing
      await expect(async () => {
        await termine.tap()
        await expect(bolla).toBeVisible({ timeout: 500 })
      }).toPass({ timeout: 10_000 })
      await termine.tap()
      await expect(bolla).toBeHidden()
    } else {
      await expect(async () => {
        await page.mouse.move(0, 0)
        await termine.hover()
        await expect(bolla).toBeVisible({ timeout: 500 })
      }).toPass({ timeout: 10_000 })
    }
  })

  test('FAQ answers explain their acronyms, and the full list is on the newcomers page', async ({ page }) => {
    await page.goto('/inizia-a-giocare')
    await page.getByText('Devo per forza creare un personaggio?').click()
    await expect(page.locator('details[open]').getByRole('button', { name: 'PGOS' })).toBeVisible()
    await expect(page.locator('#termine-pab')).toContainText('130 PAB')
  })
})

test('the date of Fulcron: today in the footer, any day in the calendar page', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-31T12:00:00'))
  await page.goto('/wiki/storia/calendario')
  await expect(page.locator('footer').getByRole('link', { name: /Oggi a Fulcron/ })).toContainText(
    'Samana 31 Frimaio 3026 · Festa del Sole',
  )
  await page.getByLabel('Una data del nostro calendario').fill('2017-05-28')
  await expect(page.getByText('Surana 28 Fiorile 3017')).toBeVisible()
})

test('a wiki page without its own description does not repeat its first paragraph as the subtitle', async ({
  page,
}) => {
  await page.goto('/wiki/fazioni/la-setta')
  await expect(page.locator('article').getByText(/^La Setta è un organizzazione politica/)).toHaveCount(1)
  await page.goto('/wiki/storia')
  await expect(page.locator('article').getByText('Indice storico degli eventi')).toBeVisible()
})

test('photos and events lead to each other', async ({ page }) => {
  await page.goto('/sinfonia/eventi')
  await expect(page.getByRole('link', { name: 'Le foto' })).toHaveCount(7)
  await page.goto('/gallery/il-banchetto-dei-guitti')
  await page.getByRole('link', { name: /cronologia della Sinfonia/ }).click()
  await expect(page).toHaveURL('/sinfonia/eventi#evento-il-banchetto-dei-guitti')
  await expect(page.locator('#evento-il-banchetto-dei-guitti')).toBeInViewport()
  await page.goto('/oneshot')
  await expect(page.getByRole('link', { name: 'Foto dell’evento' })).toHaveAttribute('href', '/gallery/sunless-dawn')
})

test.describe('day and night chosen in the footer', () => {
  const sfondo = (page: import('@playwright/test').Page) =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const NOTTE = 'rgb(11, 26, 33)'
  const GIORNO = 'rgb(247, 243, 234)'
  const scelta = (page: import('@playwright/test').Page, nome: string) =>
    page.getByRole('group', { name: 'Colori del sito' }).getByRole('button', { name: nome })

  test('night on a light device, kept when the page is opened again', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/wiki/storia')
    expect(await sfondo(page)).toBe(GIORNO)
    // Retry until the page has hydrated: a click before that does nothing
    await expect(async () => {
      await scelta(page, 'Notte').click()
      await expect(scelta(page, 'Notte')).toHaveAttribute('aria-pressed', 'true', { timeout: 500 })
    }).toPass({ timeout: 10_000 })
    expect(await sfondo(page)).toBe(NOTTE)
    // Already dark in the generated page, before any script of the app runs: no flash
    await page.goto('/chi-siamo', { waitUntil: 'commit' })
    await page.waitForSelector('body')
    expect(await sfondo(page)).toBe(NOTTE)
    await expect(scelta(page, 'Notte')).toHaveAttribute('aria-pressed', 'true')
  })

  test('day on a dark device, and automatic follows the device again', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/sinfonia')
    expect(await sfondo(page)).toBe(NOTTE)
    await expect(async () => {
      await scelta(page, 'Giorno').click()
      await expect(scelta(page, 'Giorno')).toHaveAttribute('aria-pressed', 'true', { timeout: 500 })
    }).toPass({ timeout: 10_000 })
    expect(await sfondo(page)).toBe(GIORNO)
    await scelta(page, 'Automatico, come il dispositivo').click()
    expect(await sfondo(page)).toBe(NOTTE)
    await page.reload()
    expect(await sfondo(page)).toBe(NOTTE)
  })

  test('the oneshot pages, which keep their own look, have no choice to make', async ({ page }) => {
    await page.goto('/oneshot/sunless-dawn')
    await expect(page.getByRole('group', { name: 'Colori del sito' })).toHaveCount(0)
  })
})
