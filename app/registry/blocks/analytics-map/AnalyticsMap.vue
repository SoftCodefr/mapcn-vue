<script setup lang="ts">
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import OverviewCard from "./OverviewCard.vue";
import BreakdownCard from "./BreakdownCard.vue";
import {
  browsersRows,
  countriesRows,
  locations,
  referrersRows,
  visitedPagesRows,
} from "./data";

const MAP_HEIGHT = "38rem";
</script>

<template>
  <div
    class="bg-background relative min-h-screen"
    :style="{ '--map-height': MAP_HEIGHT }"
  >
    <div class="relative h-(--map-height)">
      <ClientOnly>
        <Map
          :center="[-2, 16]"
          :zoom="1.5"
          :scroll-zoom="false"
          :render-world-copies="true"
        >
          <MapControls show-fullscreen />
          <MapMarker
            v-for="location in locations"
            :key="location.city"
            :longitude="location.lng"
            :latitude="location.lat"
          >
            <MarkerContent>
              <div
                class="rounded-full bg-blue-500/70"
                :style="{
                  width: location.size * 3 + 'px',
                  height: location.size * 3 + 'px',
                }"
              />
            </MarkerContent>
            <MarkerTooltip
              :offset="20"
              class="bg-background text-foreground border"
            >
              <p class="text-muted-foreground font-medium">
                {{ location.city }}
              </p>
              <p class="mt-0.5">{{ location.size }} active users</p>
            </MarkerTooltip>
          </MapMarker>
        </Map>
      </ClientOnly>
      <div
        class="via-background/30 to-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent"
        aria-hidden
      />
      <OverviewCard />
    </div>

    <div class="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <BreakdownCard title="Visited pages" :rows="visitedPagesRows" />
      <BreakdownCard title="Referrers" :rows="referrersRows" />
      <BreakdownCard title="Countries" :rows="countriesRows" />
      <BreakdownCard title="Browsers" :rows="browsersRows" />
    </div>
  </div>
</template>
