<script setup lang="ts">
import { slugToTitle } from "@/lib/blocks";

definePageMeta({ layout: "blank" });

const route = useRoute();
const name = computed(() => String(route.params.name ?? ""));

// Lazy-load the matching block component. Each Vue file has a default export
// (the SFC) which Vue treats as the component.
const blockMap: Record<string, () => Promise<unknown>> = {
  heatmap: () => import("@/registry/blocks/heatmap/Heatmap.vue"),
  "delivery-tracker": () =>
    import("@/registry/blocks/delivery-tracker/DeliveryTracker.vue"),
  "analytics-map": () =>
    import("@/registry/blocks/analytics-map/AnalyticsMap.vue"),
  "logistics-network": () =>
    import("@/registry/blocks/logistics-network/LogisticsNetwork.vue"),
};

const BlockComponent = computed(() => {
  const loader = blockMap[name.value];
  if (!loader) return null;
  return defineAsyncComponent(loader as () => Promise<{ default: unknown }>);
});

const title = computed(() => slugToTitle(name.value));
useHead({ title: () => `${title.value} · mapcn-vue` });
</script>

<template>
  <component :is="BlockComponent" v-if="BlockComponent" />
  <div
    v-else
    class="flex min-h-screen items-center justify-center text-center"
  >
    <div>
      <h1 class="text-2xl font-semibold">Block not found</h1>
      <p class="text-muted-foreground mt-2">
        No block registered with the name <code>{{ name }}</code>.
      </p>
    </div>
  </div>
</template>
