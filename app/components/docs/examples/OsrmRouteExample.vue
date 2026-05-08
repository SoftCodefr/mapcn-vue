<script setup lang="ts">
import { Clock, Loader2, Route as RouteIcon } from "lucide-vue-next";

const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

interface RouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

const routes = ref<RouteData[]>([]);
const selectedIndex = ref(0);
const isLoading = ref(true);

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

onMounted(async () => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`,
    );
    const data = await response.json();
    if (data.routes?.length > 0) {
      routes.value = data.routes.map(
        (r: {
          geometry: { coordinates: [number, number][] };
          duration: number;
          distance: number;
        }) => ({
          coordinates: r.geometry.coordinates,
          duration: r.duration,
          distance: r.distance,
        }),
      );
    }
  } catch (err) {
    console.error("Failed to fetch routes:", err);
  } finally {
    isLoading.value = false;
  }
});

// Re-order so the selected route renders on top.
const sortedRoutes = computed(() =>
  routes.value
    .map((route, index) => ({ route, index }))
    .sort((a, b) => {
      if (a.index === selectedIndex.value) return 1;
      if (b.index === selectedIndex.value) return -1;
      return 0;
    }),
);
</script>

<template>
  <div class="relative h-[500px] w-full">
    <ClientOnly>
      <Map :center="[4.69, 52.14]" :zoom="8.5">
        <MapRoute
          v-for="{ route, index } in sortedRoutes"
          :key="index"
          :coordinates="route.coordinates"
          :color="index === selectedIndex ? '#6366f1' : '#94a3b8'"
          :width="index === selectedIndex ? 6 : 5"
          :opacity="index === selectedIndex ? 1 : 0.6"
          @click="selectedIndex = index"
        />

        <MapMarker :longitude="start.lng" :latitude="start.lat">
          <MarkerContent>
            <div
              class="size-5 rounded-full border-2 border-white bg-green-500 shadow-lg"
            />
            <MarkerLabel position="top">{{ start.name }}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        <MapMarker :longitude="end.lng" :latitude="end.lat">
          <MarkerContent>
            <div
              class="size-5 rounded-full border-2 border-white bg-red-500 shadow-lg"
            />
            <MarkerLabel position="bottom">{{ end.name }}</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>
    </ClientOnly>

    <div
      v-if="routes.length > 0"
      class="absolute top-3 left-3 z-10 flex flex-col gap-2"
    >
      <button
        v-for="(route, index) in routes"
        :key="index"
        type="button"
        :class="[
          'inline-flex h-9 items-center justify-start gap-3 rounded-md px-3 text-xs font-medium shadow-sm transition-colors',
          index === selectedIndex
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
        @click="selectedIndex = index"
      >
        <span class="flex items-center gap-1.5">
          <Clock class="size-3.5" />
          <span>{{ formatDuration(route.duration) }}</span>
        </span>
        <span class="flex items-center gap-1.5 text-xs opacity-80">
          <RouteIcon class="size-3" />
          {{ formatDistance(route.distance) }}
        </span>
        <span
          v-if="index === 0"
          class="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
        >
          Fastest
        </span>
      </button>
    </div>

    <div
      v-if="isLoading"
      class="bg-background/50 absolute inset-0 z-20 flex items-center justify-center"
    >
      <Loader2 class="text-muted-foreground size-6 animate-spin" />
    </div>
  </div>
</template>
