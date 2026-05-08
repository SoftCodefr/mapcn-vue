<script setup lang="ts">
const locations = [
  { id: 1, name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { id: 2, name: "Central Park", lng: -73.9654, lat: 40.7829 },
  { id: 3, name: "Times Square", lng: -73.9855, lat: 40.758 },
];
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.98, 40.76]" :zoom="12">
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
    </ClientOnly>
  </div>
</template>
