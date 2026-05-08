<script setup lang="ts">
const route: [number, number][] = [
  [-74.006, 40.7128],   // NYC City Hall
  [-73.9857, 40.7484],  // Empire State Building
  [-73.9772, 40.7527],  // Grand Central
  [-73.9654, 40.7829],  // Central Park
];

const stops = [
  { name: "City Hall", lng: -74.006, lat: 40.7128 },
  { name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
  { name: "Central Park", lng: -73.9654, lat: 40.7829 },
];
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.98, 40.75]" :zoom="11.2">
        <MapRoute
          :coordinates="route"
          color="#3b82f6"
          :width="4"
          :opacity="0.8"
        />
        <MapMarker
          v-for="(stop, index) in stops"
          :key="stop.name"
          :longitude="stop.lng"
          :latitude="stop.lat"
        >
          <MarkerContent>
            <div
              class="flex size-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-semibold text-white shadow-lg"
            >
              {{ index + 1 }}
            </div>
          </MarkerContent>
          <MarkerTooltip>{{ stop.name }}</MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
  </div>
</template>
