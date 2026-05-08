<script setup lang="ts">
import { computed } from "vue";
import { Network, Plane, Truck } from "lucide-vue-next";
import {
  regionLabels,
  statusConfig,
  type Hub,
  type Route,
} from "./data";

const props = defineProps<{ hubs: Hub[]; routes: Route[] }>();

const regionIcons: Record<Hub["region"], string> = {
  west: "W",
  midwest: "MW",
  south: "S",
  northeast: "NE",
};

const totalShipments = computed(() =>
  props.routes.reduce((s, r) => s + r.shipments, 0),
);
const activeCount = computed(
  () => props.routes.filter((r) => r.status === "active").length,
);
const delayedCount = computed(
  () => props.routes.filter((r) => r.status === "delayed").length,
);
const airRouteCount = computed(
  () => props.routes.filter((r) => r.mode === "air").length,
);
const groundRouteCount = computed(
  () => props.routes.filter((r) => r.mode === "ground").length,
);

const regions = ["west", "midwest", "south", "northeast"] as const;
const hubsInRegion = (region: Hub["region"]) =>
  props.hubs.filter((h) => h.region === region).length;
</script>

<template>
  <aside
    class="bg-sidebar text-sidebar-foreground flex w-64 shrink-0 flex-col border-r"
  >
    <!-- Header -->
    <div class="p-4">
      <div class="flex items-center gap-2">
        <div
          class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
        >
          <Network class="size-4" />
        </div>
        <div class="flex flex-col gap-0.5 leading-none">
          <span class="text-sm font-medium">Logistics Network</span>
          <span class="text-muted-foreground text-xs">Domestic Routes</span>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-2">
        <div
          class="bg-background rounded-md border px-2.5 py-2 text-center"
        >
          <p class="text-lg leading-none font-bold tabular-nums">
            {{ hubs.length }}
          </p>
          <p class="text-muted-foreground mt-1 text-[10px]">Hubs</p>
        </div>
        <div
          class="bg-background rounded-md border px-2.5 py-2 text-center"
        >
          <p class="text-lg leading-none font-bold tabular-nums">
            {{ activeCount }}
          </p>
          <p class="text-muted-foreground mt-1 text-[10px]">Active</p>
        </div>
        <div
          class="bg-background rounded-md border px-2.5 py-2 text-center"
        >
          <p class="text-lg leading-none font-bold tabular-nums">
            {{ delayedCount }}
          </p>
          <p class="text-muted-foreground mt-1 text-[10px]">Delayed</p>
        </div>
      </div>
    </div>

    <div class="bg-border h-px" />

    <!-- Filter groups -->
    <div class="flex-1 overflow-y-auto px-2 py-3 text-sm">
      <!-- Transport Mode -->
      <div class="mb-4">
        <p
          class="text-muted-foreground mb-2 px-2 text-[11px] font-medium tracking-wider uppercase"
        >
          Transport Mode
        </p>
        <ul class="space-y-1">
          <li
            class="text-foreground/80 flex items-center justify-between rounded-md px-2 py-1.5"
          >
            <span class="flex items-center gap-2">
              <Plane class="size-4" />
              <span>Air Freight</span>
            </span>
            <span
              class="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-medium tabular-nums"
            >
              {{ airRouteCount }}
            </span>
          </li>
          <li
            class="text-foreground/80 flex items-center justify-between rounded-md px-2 py-1.5"
          >
            <span class="flex items-center gap-2">
              <Truck class="size-4" />
              <span>Ground</span>
            </span>
            <span
              class="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-medium tabular-nums"
            >
              {{ groundRouteCount }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Status -->
      <div class="mb-4">
        <p
          class="text-muted-foreground mb-2 px-2 text-[11px] font-medium tracking-wider uppercase"
        >
          Status
        </p>
        <ul class="space-y-1">
          <li
            class="text-foreground/80 flex items-center justify-between rounded-md px-2 py-1.5"
          >
            <span class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: statusConfig.active.color }"
              />
              <span>{{ statusConfig.active.label }}</span>
            </span>
            <span
              class="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-medium tabular-nums"
            >
              {{ activeCount }}
            </span>
          </li>
          <li
            class="text-foreground/80 flex items-center justify-between rounded-md px-2 py-1.5"
          >
            <span class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: statusConfig.delayed.color }"
              />
              <span>{{ statusConfig.delayed.label }}</span>
            </span>
            <span
              class="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-medium tabular-nums"
            >
              {{ delayedCount }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Region -->
      <div class="mb-4">
        <p
          class="text-muted-foreground mb-2 px-2 text-[11px] font-medium tracking-wider uppercase"
        >
          Region
        </p>
        <ul class="space-y-1">
          <li
            v-for="region in regions"
            :key="region"
            class="text-foreground/80 flex items-center justify-between rounded-md px-2 py-1.5"
          >
            <span class="flex items-center gap-2">
              <span
                class="bg-muted text-muted-foreground flex size-4 items-center justify-center rounded text-[9px] font-bold"
              >
                {{ regionIcons[region] }}
              </span>
              <span>{{ regionLabels[region] }}</span>
            </span>
            <span
              class="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-medium tabular-nums"
            >
              {{ hubsInRegion(region) }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 pt-0">
      <p
        class="text-muted-foreground mb-2 text-[11px] font-medium tracking-wider uppercase"
      >
        Summary
      </p>
      <div
        class="bg-background space-y-1.5 rounded-md border px-3 py-2 text-xs"
      >
        <div class="flex justify-between">
          <span class="text-muted-foreground">Shipments</span>
          <span class="text-primary font-medium tabular-nums">
            {{ totalShipments.toLocaleString() }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Routes</span>
          <span class="text-primary font-medium tabular-nums">
            {{ routes.length }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>
