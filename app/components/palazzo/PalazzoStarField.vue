<script setup lang="ts">
// Twinkling, slowly drifting stars behind the Palazzo pages.
// A lightweight canvas version of the tsParticles background of the original site.
const canvas = ref<HTMLCanvasElement>()

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  twinkle: number
}

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let stars: Star[] = []
  let width = 0
  let height = 0
  let frame = 0

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = el.clientWidth
    height = el.clientHeight
    el.width = width * dpr
    el.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // About 200 stars on a desktop screen, fewer on phones
    const count = Math.round(Math.min(220, (width * height) / 6000))
    stars = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.08 + Math.random() * 0.22
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.1 + Math.random() * 0.9,
        twinkle: (Math.random() < 0.5 ? -1 : 1) * (0.002 + Math.random() * 0.006),
      }
    })
    draw()
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    for (const s of stars) {
      ctx.globalAlpha = s.alpha
      ctx.beginPath()
      ctx.arc(s.x, s.y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const step = () => {
    for (const s of stars) {
      s.x = (s.x + s.vx + width) % width
      s.y = (s.y + s.vy + height) % height
      s.alpha += s.twinkle
      if (s.alpha <= 0.1 || s.alpha >= 1) s.twinkle *= -1
    }
    draw()
    frame = requestAnimationFrame(step)
  }

  resize()
  window.addEventListener('resize', resize)
  if (!reduceMotion) frame = requestAnimationFrame(step)

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden="true" />
</template>
