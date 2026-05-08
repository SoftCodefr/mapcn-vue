<script setup lang="ts">
interface EarthquakeProperties {
  mag: number;
  place: string;
  tsunami: number;
}

const selectedPoint = ref<{
  coordinates: [number, number];
  properties: EarthquakeProperties;
} | null>(null);

const selectedKey = computed(() =>
  selectedPoint.value
    ? `${selectedPoint.value.coordinates[0]}-${selectedPoint.value.coordinates[1]}`
    : "",
);
</script>

<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-103.59, 40.66]" :zoom="3.4" :fade-duration="0">
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
                properties: feature.properties as EarthquakeProperties,
              })
          "
        />

        <MapPopup
          v-if="selectedPoint"
          :key="selectedKey"
          :longitude="selectedPoint.coordinates[0]"
          :latitude="selectedPoint.coordinates[1]"
          :close-on-click="false"
          :focus-after-open="false"
          close-button
          class="w-34"
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
    </ClientOnly>
  </div>
</template>
