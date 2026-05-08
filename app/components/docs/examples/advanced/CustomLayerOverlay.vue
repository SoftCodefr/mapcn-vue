<script setup lang="ts">
import type { MapMouseEvent } from "maplibre-gl";
import { Layers, X } from "lucide-vue-next";

const { map, isLoaded } = useMap();
const isLayerVisible = ref(false);
const hoveredPark = ref<string | null>(null);

const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Central Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.9731, 40.7644],
          [-73.9819, 40.7681],
          [-73.958, 40.8006],
          [-73.9493, 40.7969],
          [-73.9731, 40.7644],
        ]],
      },
    },
    {
      type: "Feature",
      properties: { name: "Bryant Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.9837, 40.7536],
          [-73.9854, 40.7542],
          [-73.984, 40.7559],
          [-73.9823, 40.7553],
          [-73.9837, 40.7536],
        ]],
      },
    },
  ],
};

let cleanup: (() => void) | null = null;

watch([map, isLoaded], ([m, loaded]) => {
  cleanup?.();
  cleanup = null;
  if (!m || !loaded) return;

  if (!m.getSource("parks")) {
    m.addSource("parks", { type: "geojson", data: geojsonData });
  }
  if (!m.getLayer("parks-fill")) {
    m.addLayer({
      id: "parks-fill",
      type: "fill",
      source: "parks",
      paint: { "fill-color": "#22c55e", "fill-opacity": 0.4 },
      layout: { visibility: isLayerVisible.value ? "visible" : "none" },
    });
  }
  if (!m.getLayer("parks-outline")) {
    m.addLayer({
      id: "parks-outline",
      type: "line",
      source: "parks",
      paint: { "line-color": "#16a34a", "line-width": 2 },
      layout: { visibility: isLayerVisible.value ? "visible" : "none" },
    });
  }

  const onEnter = () => { m.getCanvas().style.cursor = "pointer"; };
  const onLeave = () => {
    m.getCanvas().style.cursor = "";
    hoveredPark.value = null;
  };
  const onMove = (e: MapMouseEvent) => {
    const features = m.queryRenderedFeatures(e.point, { layers: ["parks-fill"] });
    if (features.length > 0) hoveredPark.value = features[0].properties?.name ?? null;
  };

  m.on("mouseenter", "parks-fill", onEnter);
  m.on("mouseleave", "parks-fill", onLeave);
  m.on("mousemove", "parks-fill", onMove);

  cleanup = () => {
    m.off("mouseenter", "parks-fill", onEnter);
    m.off("mouseleave", "parks-fill", onLeave);
    m.off("mousemove", "parks-fill", onMove);
    try {
      if (m.getLayer("parks-outline")) m.removeLayer("parks-outline");
      if (m.getLayer("parks-fill")) m.removeLayer("parks-fill");
      if (m.getSource("parks")) m.removeSource("parks");
    } catch {
      // ignore
    }
  };
});

onBeforeUnmount(() => cleanup?.());

const toggleLayer = () => {
  const m = map.value;
  if (!m) return;
  isLayerVisible.value = !isLayerVisible.value;
  const visibility = isLayerVisible.value ? "visible" : "none";
  if (m.getLayer("parks-fill")) m.setLayoutProperty("parks-fill", "visibility", visibility);
  if (m.getLayer("parks-outline")) m.setLayoutProperty("parks-outline", "visibility", visibility);
};
</script>

<template>
  <div class="absolute top-3 left-3 z-10">
    <button
      type="button"
      :class="[
        'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium shadow-sm transition-colors',
        isLayerVisible
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ]"
      @click="toggleLayer"
    >
      <X v-if="isLayerVisible" class="size-4" />
      <Layers v-else class="size-4" />
      {{ isLayerVisible ? "Hide Parks" : "Show Parks" }}
    </button>
  </div>

  <div
    v-if="hoveredPark"
    class="bg-background/90 absolute bottom-3 left-3 z-10 rounded-md border px-3 py-2 text-sm font-medium backdrop-blur"
  >
    {{ hoveredPark }}
  </div>
</template>
