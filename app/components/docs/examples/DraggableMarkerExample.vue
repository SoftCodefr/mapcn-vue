<script setup lang="ts">
import { MapPin } from "lucide-vue-next";

const draggableMarker = ref({ lng: -73.98, lat: 40.75 });

const onDrag = (lngLat: { lng: number; lat: number }) => {
  draggableMarker.value = { lng: lngLat.lng, lat: lngLat.lat };
};
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-73.98, 40.75]" :zoom="12">
        <MapMarker
          draggable
          :longitude="draggableMarker.lng"
          :latitude="draggableMarker.lat"
          @drag="onDrag"
        >
          <MarkerContent>
            <div class="cursor-move">
              <MapPin
                class="fill-black stroke-white dark:fill-white"
                :size="28"
              />
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div class="space-y-1">
              <p class="text-foreground font-medium">Coordinates</p>
              <p class="text-muted-foreground text-xs tabular-nums">
                {{ draggableMarker.lat.toFixed(4) }},
                {{ draggableMarker.lng.toFixed(4) }}
              </p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>
    </ClientOnly>
  </div>
</template>
