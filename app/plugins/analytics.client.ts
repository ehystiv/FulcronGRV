// Counts page views without cookies (see server/api/hit.post.ts).
// Nothing is sent in development or when the browser asks not to be tracked.
export default defineNuxtPlugin(() => {
  if (import.meta.dev) return
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  if (nav.doNotTrack === '1' || nav.globalPrivacyControl) return

  let first = true
  const send = (path: string) => {
    const payload = JSON.stringify({ p: path, r: first ? document.referrer : '' })
    first = false
    if (!navigator.sendBeacon?.('/api/hit', new Blob([payload], { type: 'application/json' }))) {
      fetch('/api/hit', {
        method: 'POST',
        body: payload,
        keepalive: true,
        headers: { 'content-type': 'application/json' },
      }).catch(() => {})
    }
  }

  const router = useRouter()
  router.isReady().then(() => send(router.currentRoute.value.path))
  router.afterEach((to, from) => {
    if (to.path !== from.path) send(to.path)
  })
})
