<script setup lang="ts">
import { Navigation } from "lucide-vue-next";

const destination = {
  name: "New York",
  description: "United States",
  center: [-74.006, 40.7128] as [number, number],
  startCenter: [10, 50] as [number, number],
};

const mapRef = useTemplateRef<{
  map: { value: import("maplibre-gl").Map | null };
}>("map");

const flyTo = () => {
  mapRef.value?.map?.value?.flyTo({
    center: destination.center,
    zoom: 14,
    duration: 2500,
  });
};
</script>

<template>
  <ExampleCard class="aspect-square" :stagger="6">
    <ClientOnly>
      <Map
        ref="map"
        :center="destination.startCenter"
        :zoom="0.6"
        :projection="{ type: 'globe' }"
      >
        <MapMarker
          :longitude="destination.center[0]"
          :latitude="destination.center[1]"
        >
          <MarkerContent>
            <div class="relative flex items-center justify-center">
              <div
                class="absolute size-6 animate-ping rounded-full bg-cyan-500/20"
              />
              <div
                class="size-4 rounded-full border-2 border-white bg-cyan-500 shadow-lg"
              />
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <div class="text-center">
              <div class="font-medium">{{ destination.name }}</div>
              <div class="text-background/70 text-[10px]">
                {{ destination.description }}
              </div>
            </div>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
    <button
      type="button"
      aria-label="Fly to New York"
      class="bg-secondary hover:bg-secondary/80 absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md transition-colors"
      @click="flyTo"
    >
      <Navigation class="size-4" />
    </button>
  </ExampleCard>
</template>
