// Draws public/mappa/anello.jpg, the still preview of the interactive map: the ::world-map box and the share
// preview of /wiki/mappa use it. Run it on the generated site after changing the map:
//
//   npm run generate && npm run mappa:anteprima
//
// The first time Playwright needs its browser: npx playwright install chromium (or set CHROMIUM_PATH to a Chromium
// already on the machine, as for the tests)
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'

const PORT = 4398
const OUTPUT = 'public/mappa/anello.jpg'

const server = spawn(process.execPath, ['tests/serve.mjs', String(PORT)], { stdio: ['ignore', 'pipe', 'inherit'] })
await new Promise((resolve, reject) => {
  server.stdout.once('data', resolve)
  server.once('exit', () => reject(new Error('Il server non è partito: manca .output/public?')))
})

let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
  // A square view a little larger than the map, so it fits at about 1240px
  const page = await browser.newPage({ viewport: { width: 1300, height: 1404 }, deviceScaleFactor: 1 })
  await page.goto(`http://localhost:${PORT}/wiki/mappa`)
  // Only the map: no site header, title box, buttons or panels
  await page.addStyleTag({
    content: 'header, section > div:not(.mappa), section > aside { display: none !important }',
  })
  // Trees and mountains are drawn in the browser after loading
  await page.locator('.mappa use[href="#m-latifoglia"]').first().waitFor({ state: 'attached' })
  await page.waitForTimeout(500)
  const box = await page.locator('.mappa rect.m-cornice').first().boundingBox()
  if (!box) throw new Error('Mappa non trovata nella pagina')
  await page.screenshot({
    path: OUTPUT,
    type: 'jpeg',
    quality: 82,
    clip: { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8 },
  })
  console.log(`Scritta ${OUTPUT}`)
} finally {
  server.kill()
  await browser?.close()
}
