<script setup lang="ts">
import { computed } from "vue";
import {
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import {
  modeConfig,
  regionLabels,
  statusConfig,
  type Hub,
  type Route,
} from "./data";

const props = defineProps<{ hubs: Hub[]; routes: Route[] }>();

const arcs = computed(() => {
  const hubById: Record<string, Hub> = Object.fromEntries(
    props.hubs.map((hub) => [hub.id, hub] as const),
  );
  return props.routes.flatMap((route) => {
    const fromHub = hubById[route.from];
    const toHub = hubById[route.to];
    if (!fromHub || !toHub) return [];
    return [
      {
        id: `${route.from}-${route.to}`,
        from: [fromHub.lng, fromHub.lat] as [number, number],
        to: [toHub.lng, toHub.lat] as [number, number],
        color:
          route.status === "delayed"
            ? statusConfig.delayed.color
            : modeConfig[route.mode].color,
      },
    ];
  });
});
</script>

<template>
  <div class="relative h-full">
    <!-- Legend overlay -->
    <div
      class="border-border/40 bg-background/70 absolute top-4 left-4 z-20 flex items-center gap-3 rounded-lg border px-2.5 py-1.5 backdrop-blur-sm"
    >
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5">
          <span
            class="h-0.5 w-4 shrink-0 rounded-full"
            :style="{ backgroundColor: modeConfig.air.color }"
          />
          <span>{{ modeConfig.air.label }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="h-0.5 w-4 shrink-0 rounded-full"
            :style="{ backgroundColor: modeConfig.ground.color }"
          />
          <span>{{ modeConfig.ground.label }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="h-0.5 w-4 shrink-0 rounded-full"
            :style="{ backgroundColor: statusConfig.delayed.color }"
          />
          <span>{{ statusConfig.delayed.label }}</span>
        </div>
        <div class="bg-border h-4 w-px" />
        <div class="flex items-center gap-1.5">
          <div
            class="size-2.5 shrink-0 rounded-full border border-white bg-blue-500 shadow-sm"
          />
          <span>Hub</span>
        </div>
      </div>
    </div>

    <ClientOnly>
      <Map :center="[-98, 39]" :zoom="4" :projection="{ type: 'globe' }">
        <MapControls />
        <MapArc
          :data="arcs"
          :curvature="0.3"
          :paint="{
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-opacity': 0.65,
          }"
          :interactive="false"
        />

        <MapMarker
          v-for="hub in hubs"
          :key="hub.id"
          :longitude="hub.lng"
          :latitude="hub.lat"
        >
          <MarkerContent>
            <div
              class="size-3 rounded-full border-2 border-white bg-blue-500 shadow-md"
            />
          </MarkerContent>
          <MarkerTooltip
            :offset="16"
            class="bg-background text-foreground border px-2.5 py-1.5"
          >
            <p class="font-medium">{{ hub.city }}</p>
            <p class="text-muted-foreground mt-1">
              {{ hub.shipments.toLocaleString() }} shipments
              <span class="mx-1">•</span>
              {{ regionLabels[hub.region] }}
            </p>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
  </div>
</template>
