<script setup lang="ts">
import LayerMarkersOverlay from "./advanced/LayerMarkersOverlay.vue";
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.98, 40.75]" :zoom="11">
        <LayerMarkersOverlay />
      </Map>
    </ClientOnly>
  </div>
</template>
