<script setup lang="ts">
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

function generateRandomPoints(
  count: number,
): GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { id: number; name: string; category: string }
> {
  const center = { lng: -73.98, lat: 40.75 };
  const features: GeoJSON.Feature<
    GeoJSON.Point,
    { id: number; name: string; category: string }
  >[] = [];
  for (let i = 0; i < count; i++) {
    const lng = center.lng + (Math.random() - 0.5) * 0.15;
    const lat = center.lat + (Math.random() - 0.5) * 0.1;
    features.push({
      type: "Feature",
      properties: {
        id: i,
        name: `Location ${i + 1}`,
        category: ["Restaurant", "Cafe", "Bar", "Shop"][
          Math.floor(Math.random() * 4)
        ]!,
      },
      geometry: { type: "Point", coordinates: [lng, lat] },
    });
  }
  return { type: "FeatureCollection", features };
}

const pointsData = generateRandomPoints(200);

interface SelectedPoint {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
}

const { map, isLoaded } = useMap();
const id = useId();
const sourceId = `markers-source-${id}`;
const layerId = `markers-layer-${id}`;
const selectedPoint = ref<SelectedPoint | null>(null);

let cleanup: (() => void) | null = null;

watch([map, isLoaded], ([m, loaded]) => {
  cleanup?.();
  cleanup = null;
  if (!m || !loaded) return;

  m.addSource(sourceId, { type: "geojson", data: pointsData });
  m.addLayer({
    id: layerId,
    type: "circle",
    source: sourceId,
    paint: {
      "circle-radius": 6,
      "circle-color": "#3b82f6",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  const onClick = (e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
    if (!e.features?.length) return;
    const feature = e.features[0];
    const coords = (feature.geometry as GeoJSON.Point).coordinates as [
      number,
      number,
    ];
    selectedPoint.value = {
      id: feature.properties?.id,
      name: feature.properties?.name,
      category: feature.properties?.category,
      coordinates: coords,
    };
  };
  const onEnter = () => {
    m.getCanvas().style.cursor = "pointer";
  };
  const onLeave = () => {
    m.getCanvas().style.cursor = "";
  };

  m.on("click", layerId, onClick);
  m.on("mouseenter", layerId, onEnter);
  m.on("mouseleave", layerId, onLeave);

  cleanup = () => {
    m.off("click", layerId, onClick);
    m.off("mouseenter", layerId, onEnter);
    m.off("mouseleave", layerId, onLeave);
    try {
      if (m.getLayer(layerId)) m.removeLayer(layerId);
      if (m.getSource(sourceId)) m.removeSource(sourceId);
    } catch {
      // ignore
    }
  };
});

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <MapPopup
    v-if="selectedPoint"
    :longitude="selectedPoint.coordinates[0]"
    :latitude="selectedPoint.coordinates[1]"
    :close-on-click="false"
    :focus-after-open="false"
    :offset="10"
    close-button
    @close="selectedPoint = null"
  >
    <div class="min-w-24">
      <p class="font-medium">{{ selectedPoint.name }}</p>
      <p class="text-muted-foreground text-sm">{{ selectedPoint.category }}</p>
    </div>
  </MapPopup>
</template>
