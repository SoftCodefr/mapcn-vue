<script setup lang="ts">
import { Mountain, RotateCcw } from "lucide-vue-next";
import MapControllerOverlay from "./advanced/MapControllerOverlay.vue";
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.9857, 40.7484]" :zoom="15">
        <MapControllerOverlay />
      </Map>
    </ClientOnly>
  </div>
</template>
