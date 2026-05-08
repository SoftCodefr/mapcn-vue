<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-74.006, 40.7128]" :zoom="12" />
    </ClientOnly>
  </div>
</template>
