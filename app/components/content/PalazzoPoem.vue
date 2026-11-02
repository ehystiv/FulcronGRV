<template>
  <!-- Verses in "Italian Cursive" between two ornaments -->
  <div v-reveal class="not-prose container-site my-12 flex flex-col items-center text-center text-white">
    <img src="/oneshot/palazzo-destini/ornamento.png" alt="" class="w-48 invert" width="700" height="400" />
    <div class="my-2 max-w-[70%] font-cursive text-[clamp(1.4rem,3vw,2rem)] leading-snug [&_p]:m-0">
      <slot />
    </div>
    <img src="/oneshot/palazzo-destini/ornamento.png" alt="" class="w-48 invert" width="700" height="400" />
  </div>
</template>
