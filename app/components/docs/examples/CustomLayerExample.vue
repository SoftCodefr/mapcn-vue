<script setup lang="ts">
import CustomLayerOverlay from "./advanced/CustomLayerOverlay.vue";
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.97, 40.78]" :zoom="11.8">
        <MapControls />
        <CustomLayerOverlay />
      </Map>
    </ClientOnly>
  </div>
</template>
