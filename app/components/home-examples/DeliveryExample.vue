<script setup lang="ts">
import { Truck } from "lucide-vue-next";

const store = { lng: -0.14, lat: 51.5154 };
const home = { lng: -0.07, lat: 51.51 };

const route = ref<[number, number][]>([]);
const truckPosition = ref<[number, number] | null>(null);

onMounted(async () => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${store.lng},${store.lat};${home.lng},${home.lat}?overview=full&geometries=geojson`,
    );
    const data = await response.json();
    const coords: [number, number][] | undefined =
      data?.routes?.[0]?.geometry?.coordinates;
    if (!coords) return;
    route.value = coords;
    const truckIdx = Math.floor(coords.length * 0.6);
    truckPosition.value = coords[truckIdx] ?? null;
  } catch (err) {
    console.error("Failed to fetch route:", err);
  }
});
</script>

<template>
  <ExampleCard
    class="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto"
    :stagger="9"
  >
    <ClientOnly>
      <Map :center="[-0.105, 51.511]" :zoom="12.4">
        <MapRoute
          v-if="route.length"
          :coordinates="route"
          :width="4"
          color="#4285F4"
        />

        <MapMarker :longitude="store.lng" :latitude="store.lat">
          <MarkerContent>
            <div
              class="size-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-lg"
            />
            <MarkerLabel>Store</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        <MapMarker
          v-if="truckPosition"
          :longitude="truckPosition[0]"
          :latitude="truckPosition[1]"
        >
          <MarkerContent>
            <div class="rounded-full bg-blue-500 p-1.5 shadow-lg">
              <Truck class="size-3 text-white" />
            </div>
          </MarkerContent>
          <MarkerTooltip>On the way</MarkerTooltip>
        </MapMarker>

        <MapMarker :longitude="home.lng" :latitude="home.lat">
          <MarkerContent>
            <div
              class="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg"
            />
            <MarkerLabel>Home</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>
    </ClientOnly>
  </ExampleCard>
</template>
