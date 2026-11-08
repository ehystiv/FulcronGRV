// Draws the two still images of the interactive map, from the generated site:
// - public/mappa/anello.jpg, the preview: the ::world-map box and the share preview of /wiki/mappa use it;
// - public/mappa/rilievo.webp, the skin of the 3D view: the same map without names and symbols, 2048px.
// Run it after changing the map:
//
//   npm run generate && npm run mappa:anteprima
//
// The first time Playwright needs its browser: npx playwright install chromium (or set CHROMIUM_PATH to a Chromium
// already on the machine, as for the tests)
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const PORT = 4398
const ANTEPRIMA = 'public/mappa/anello.jpg'
const PELLE = 'public/mappa/rilievo.webp'
const LATO_PELLE = 2048

const server = spawn(process.execPath, ['tests/serve.mjs', String(PORT)], { stdio: ['ignore', 'pipe', 'inherit'] })
await new Promise((resolve, reject) => {
  server.stdout.once('data', resolve)
  server.once('exit', () => reject(new Error('Il server non è partito: manca .output/public?')))
})

/** Opens the map with only the drawing on screen, at the given pixel density */
async function apri(browser, densita, extraCss = '') {
  // A square view a little larger than the map, so it fits at about 1240px
  const page = await browser.newPage({ viewport: { width: 1300, height: 1404 }, deviceScaleFactor: densita })
  await page.goto(`http://localhost:${PORT}/wiki/mappa`)
  // Only the map: no site header, title box, buttons or panels
  await page.addStyleTag({
    content: `header, section > div:not(.mappa), section > aside { display: none !important } ${extraCss}`,
  })
  // Trees and mountains are drawn in the browser after loading
  await page.locator('.mappa use[href^="#m-latifoglia"]').first().waitFor({ state: 'attached' })
  await page.waitForTimeout(500)
  return page
}

let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })

  const page = await apri(browser, 1)
  const cornice = await page.locator('.mappa rect.m-cornice').first().boundingBox()
  if (!cornice) throw new Error('Mappa non trovata nella pagina')
  await page.screenshot({
    path: ANTEPRIMA,
    type: 'jpeg',
    quality: 82,
    clip: { x: cornice.x - 4, y: cornice.y - 4, width: cornice.width + 8, height: cornice.height + 8 },
  })
  console.log(`Scritta ${ANTEPRIMA}`)

  // The skin: the whole sheet, edge to edge, without names and symbols (the 3D view draws its own)
  const foglio = await page.locator('.mappa rect[fill="#ece2c8"]').first().boundingBox()
  await page.close()
  const pagina3d = await apri(browser, LATO_PELLE / foglio.width, '.m-nomi, .m-luoghi { display: none !important }')
  const png = await pagina3d.screenshot({ type: 'png', clip: foglio })
  await sharp(png).resize(LATO_PELLE, LATO_PELLE).webp({ quality: 80 }).toFile(PELLE)
  console.log(`Scritta ${PELLE}`)
} finally {
  server.kill()
  await browser?.close()
}
