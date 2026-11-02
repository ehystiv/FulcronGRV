<template>
  <!-- Verses in "Italian Cursive" between two ornaments -->
  <div v-reveal class="not-prose container-site my-14 flex flex-col items-center text-center text-white">
    <img src="/oneshot/palazzo-destini/ornamento.png" alt="" class="w-44 opacity-90 invert" width="700" height="400" />
    <div
      class="my-3 max-w-2xl font-cursive text-[clamp(1.45rem,3vw,2.05rem)] leading-snug [text-shadow:0_2px_12px_rgb(0_0_0/0.9)] [&_p]:m-0"
    >
      <slot />
    </div>
    <img src="/oneshot/palazzo-destini/ornamento.png" alt="" class="w-44 opacity-90 invert" width="700" height="400" />
  </div>
</template>
