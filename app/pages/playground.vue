<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Map,
  MapArc,
  MapClusterLayer,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  type MapArcDatum,
  type MapViewport,
} from "@/components/ui/map";

type Demo =
  | "basic"
  | "markers"
  | "controls"
  | "popup"
  | "route"
  | "arcs"
  | "clusters"
  | "controlled";

const current = ref<Demo>("basic");

const demos: { id: Demo; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "markers", label: "Markers" },
  { id: "controls", label: "Controls" },
  { id: "popup", label: "Standalone popup" },
  { id: "route", label: "Route" },
  { id: "arcs", label: "Arcs" },
  { id: "clusters", label: "Clusters" },
  { id: "controlled", label: "Controlled viewport" },
];

// Theme is handled site-wide by the header's <ThemeToggle>; nothing to do here.

// Markers demo
const locations = [
  { id: 1, name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { id: 2, name: "Central Park", lng: -73.9654, lat: 40.7829 },
  { id: 3, name: "Times Square", lng: -73.9855, lat: 40.758 },
];

// Standalone popup demo
const popupOpen = ref(true);

// Route demo
const routeCoords: [number, number][] = [
  [-122.466, 37.716],
  [-122.45, 37.71],
  [-122.43, 37.7],
  [-122.41, 37.69],
  [-122.399, 37.683],
];

// Arcs demo
const arcs = ref<(MapArcDatum & { color: string })[]>([
  {
    id: "ny-london",
    from: [-74.006, 40.7128],
    to: [-0.1276, 51.5072],
    color: "#3b82f6",
  },
  {
    id: "london-tokyo",
    from: [-0.1276, 51.5072],
    to: [139.6917, 35.6895],
    color: "#a855f7",
  },
  {
    id: "ny-tokyo",
    from: [-74.006, 40.7128],
    to: [139.6917, 35.6895],
    color: "#ec4899",
  },
]);

// Controlled viewport demo
const viewport = ref<MapViewport>({
  center: [-74.006, 40.7128],
  zoom: 10,
  bearing: 0,
  pitch: 0,
});
const handleViewportUpdate = (next: MapViewport) => {
  viewport.value = next;
};

const flyToParis = () => {
  viewport.value = {
    center: [2.3522, 48.8566],
    zoom: 11,
    bearing: 0,
    pitch: 0,
  };
};
const flyToTokyo = () => {
  viewport.value = {
    center: [139.6917, 35.6895],
    zoom: 11,
    bearing: 0,
    pitch: 0,
  };
};

// Cluster popup state
const selectedPoint = ref<{
  coordinates: [number, number];
  properties: { mag: number; place: string; tsunami: number };
} | null>(null);

const selectedPointKey = computed(() =>
  selectedPoint.value
    ? `${selectedPoint.value.coordinates[0]}-${selectedPoint.value.coordinates[1]}`
    : "",
);
</script>

<template>
  <div class="mx-auto max-w-screen-2xl p-4">
    <header class="flex flex-wrap items-center justify-between gap-4 pb-4">
      <h1 class="text-xl font-semibold">Playground</h1>
      <nav class="flex flex-wrap gap-1">
        <button
          v-for="d in demos"
          :key="d.id"
          type="button"
          class="border-border hover:bg-accent rounded-md border px-2.5 py-1 text-xs"
          :class="
            current === d.id
              ? 'bg-foreground text-background'
              : 'bg-background text-foreground'
          "
          @click="current = d.id"
        >
          {{ d.label }}
        </button>
      </nav>
    </header>

    <main class="border-border overflow-hidden rounded-md border">
      <ClientOnly>
        <div class="h-[70vh] w-full">
          <!-- Basic -->
          <Map
            v-if="current === 'basic'"
            :center="[-74.006, 40.7128]"
            :zoom="12"
          />

          <!-- Markers -->
          <Map
            v-else-if="current === 'markers'"
            :center="[-73.98, 40.76]"
            :zoom="12"
          >
            <MapMarker
              v-for="loc in locations"
              :key="loc.id"
              :longitude="loc.lng"
              :latitude="loc.lat"
            >
              <MarkerContent>
                <div
                  class="bg-primary size-4 rounded-full border-2 border-white shadow-lg"
                />
                <MarkerLabel position="bottom">{{ loc.name }}</MarkerLabel>
              </MarkerContent>
              <MarkerTooltip>{{ loc.name }}</MarkerTooltip>
              <MarkerPopup>
                <div class="space-y-1">
                  <p class="text-foreground font-medium">{{ loc.name }}</p>
                  <p class="text-muted-foreground text-xs">
                    {{ loc.lat.toFixed(4) }}, {{ loc.lng.toFixed(4) }}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>

          <!-- Controls -->
          <Map
            v-else-if="current === 'controls'"
            :center="[2.3522, 48.8566]"
            :zoom="11"
          >
            <MapControls show-compass show-locate show-fullscreen />
          </Map>

          <!-- Standalone popup -->
          <Map
            v-else-if="current === 'popup'"
            :center="[-122.42, 37.77]"
            :zoom="12"
          >
            <MapPopup
              v-if="popupOpen"
              :longitude="-122.42"
              :latitude="37.77"
              close-button
              @close="popupOpen = false"
            >
              <p class="font-medium">Hello, San Francisco!</p>
              <p class="text-muted-foreground pt-1 text-xs">
                This popup has no marker — it's anchored to coordinates
                directly.
              </p>
            </MapPopup>
            <MapControls />
            <button
              v-if="!popupOpen"
              type="button"
              class="border-border bg-background hover:bg-accent absolute top-2 left-2 z-10 rounded-md border px-2.5 py-1 text-xs"
              @click="popupOpen = true"
            >
              Reopen popup
            </button>
          </Map>

          <!-- Route -->
          <Map
            v-else-if="current === 'route'"
            :center="[-122.43, 37.7]"
            :zoom="12"
          >
            <MapRoute
              :coordinates="routeCoords"
              color="#10b981"
              :width="4"
              :opacity="0.85"
            />
            <MapMarker
              :longitude="routeCoords[0][0]"
              :latitude="routeCoords[0][1]"
            >
              <MarkerContent>
                <div
                  class="size-4 rounded-full border-2 border-white bg-emerald-500 shadow"
                />
                <MarkerLabel position="bottom">Start</MarkerLabel>
              </MarkerContent>
            </MapMarker>
            <MapMarker
              :longitude="routeCoords[routeCoords.length - 1][0]"
              :latitude="routeCoords[routeCoords.length - 1][1]"
            >
              <MarkerContent>
                <div
                  class="size-4 rounded-full border-2 border-white bg-rose-500 shadow"
                />
                <MarkerLabel position="bottom">End</MarkerLabel>
              </MarkerContent>
            </MapMarker>
            <MapControls />
          </Map>

          <!-- Arcs -->
          <Map
            v-else-if="current === 'arcs'"
            :center="[20, 30]"
            :zoom="1.5"
            :projection="{ type: 'globe' }"
          >
            <MapArc
              :data="arcs"
              :curvature="0.3"
              :paint="{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.8,
              }"
              :hover-paint="{ 'line-width': 4, 'line-opacity': 1 }"
            />
            <MapControls />
          </Map>

          <!-- Clusters -->
          <Map
            v-else-if="current === 'clusters'"
            :center="[-103.59, 40.66]"
            :zoom="3.4"
          >
            <MapClusterLayer
              data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
              :cluster-radius="50"
              :cluster-max-zoom="14"
              :cluster-colors="['#1d8cf8', '#6d5dfc', '#e23670']"
              point-color="#1d8cf8"
              @point-click="
                (feature, coordinates) =>
                  (selectedPoint = {
                    coordinates,
                    properties: feature.properties as never,
                  })
              "
            />

            <MapPopup
              v-if="selectedPoint"
              :key="selectedPointKey"
              :longitude="selectedPoint.coordinates[0]"
              :latitude="selectedPoint.coordinates[1]"
              :close-on-click="false"
              :focus-after-open="false"
              close-button
              class="w-44"
              @close="selectedPoint = null"
            >
              <div class="text-[13px]">
                <p class="text-muted-foreground">
                  Magnitude:
                  <span class="text-foreground font-medium">
                    {{ selectedPoint.properties.mag }}
                  </span>
                </p>
                <p class="text-muted-foreground">
                  Tsunami:
                  <span class="text-foreground font-medium">
                    {{ selectedPoint.properties?.tsunami === 1 ? "Yes" : "No" }}
                  </span>
                </p>
              </div>
            </MapPopup>

            <MapControls />
          </Map>

          <!-- Controlled viewport -->
          <Map
            v-else
            :viewport="viewport"
            @update:viewport="handleViewportUpdate"
          >
            <MapControls />
            <div
              class="border-border bg-background absolute top-2 left-2 z-10 flex flex-col gap-1.5 rounded-md border p-2 text-xs shadow"
            >
              <p class="font-medium">Controlled mode</p>
              <p class="text-muted-foreground">
                {{ viewport.center[0].toFixed(3) }},
                {{ viewport.center[1].toFixed(3) }} · z
                {{ viewport.zoom.toFixed(1) }}
              </p>
              <div class="flex gap-1.5">
                <button
                  type="button"
                  class="border-border bg-background hover:bg-accent rounded-md border px-2 py-0.5"
                  @click="flyToParis"
                >
                  Paris
                </button>
                <button
                  type="button"
                  class="border-border bg-background hover:bg-accent rounded-md border px-2 py-0.5"
                  @click="flyToTokyo"
                >
                  Tokyo
                </button>
              </div>
            </div>
          </Map>
        </div>
        <template #fallback>
          <div class="text-muted-foreground grid h-[70vh] place-items-center">
            Loading…
          </div>
        </template>
      </ClientOnly>
    </main>
  </div>
</template>
