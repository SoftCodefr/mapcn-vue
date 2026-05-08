<script setup lang="ts">
import { Map } from "@/components/ui/map";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import GlobeHeatmapLayers from "./GlobeHeatmapLayers.vue";

const EARTHQUAKE_GEOJSON_URL =
  "https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson";

const HEATMAP_GRADIENT_COLORS = [
  "#fff7bc",
  "#fee391",
  "#fec44f",
  "#fe9929",
  "#d7301f",
];

const HEATMAP_COLOR_STOPS: [number, string][] = [
  [0.15, HEATMAP_GRADIENT_COLORS[0]!],
  [0.35, HEATMAP_GRADIENT_COLORS[1]!],
  [0.55, HEATMAP_GRADIENT_COLORS[2]!],
  [0.75, HEATMAP_GRADIENT_COLORS[3]!],
  [1, HEATMAP_GRADIENT_COLORS[4]!],
];
</script>

<template>
  <div class="bg-muted/50 relative h-screen">
    <div class="relative h-full">
      <ClientOnly>
        <Map
          :center="[-113, 43]"
          :zoom="3.2"
          :projection="{ type: 'globe' }"
          :pitch="24"
          :min-zoom="1.2"
          :max-zoom="8"
        >
          <GlobeHeatmapLayers />
        </Map>
      </ClientOnly>
    </div>

    <Card class="absolute top-4 left-4 z-10 w-72">
      <CardHeader>
        <CardTitle>Global Earthquakes Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-5 gap-1.5">
          <span
            v-for="color in HEATMAP_GRADIENT_COLORS"
            :key="color"
            class="h-2.5 rounded-full"
            :style="{ backgroundColor: color }"
          />
        </div>
        <div
          class="text-muted-foreground flex items-center justify-between pt-3 text-xs"
        >
          <span>Low</span>
          <span>High</span>
        </div>
        <p class="text-muted-foreground pt-2 text-xs">
          Data source:
          <a
            :href="EARTHQUAKE_GEOJSON_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            MapLibre earthquakes.geojson
          </a>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
