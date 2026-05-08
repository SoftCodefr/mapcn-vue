<script setup lang="ts">
import type { MapViewport } from "@/components/ui/map";

const viewport = ref<MapViewport>({
  center: [-74.006, 40.7128],
  zoom: 11,
  bearing: 0,
  pitch: 0,
});
</script>

<template>
  <div class="relative h-[420px] w-full">
    <ClientOnly>
      <Map v-model:viewport="viewport" />
    </ClientOnly>
    <div
      class="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border px-3 py-2 text-xs shadow backdrop-blur-md"
    >
      <p class="text-muted-foreground">
        Center
        <span class="text-foreground tabular-nums">
          {{ viewport.center[0].toFixed(3) }},
          {{ viewport.center[1].toFixed(3) }}
        </span>
      </p>
      <p class="text-muted-foreground">
        Zoom
        <span class="text-foreground tabular-nums">
          {{ viewport.zoom.toFixed(2) }}
        </span>
      </p>
    </div>
  </div>
</template>
