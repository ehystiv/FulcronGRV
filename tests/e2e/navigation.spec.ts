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
