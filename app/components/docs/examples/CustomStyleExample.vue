<script setup lang="ts">
const styles = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
};
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-74.006, 40.7128]" :zoom="11" :styles="styles" />
    </ClientOnly>
  </div>
</template>
