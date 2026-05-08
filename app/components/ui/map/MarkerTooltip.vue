<script setup lang="ts">
import { inject, onBeforeUnmount, watch } from "vue";
import type { PopupOptions } from "maplibre-gl";
import { MarkerContextKey } from "./context";
import { usePopup } from "./composables/use-popup";
import PopupShell from "./PopupShell.vue";

type Props = {
  /** Additional CSS classes for the tooltip container */
  class?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

const props = withDefaults(defineProps<Props>(), {
  offset: 16,
});

const ctx = inject(MarkerContextKey, null);
if (!ctx) {
  throw new Error("MarkerTooltip must be used within a MapMarker component");
}

const { container, popup, create } = usePopup(() => props);

let cleanup: (() => void) | null = null;

watch(
  () => [ctx.marker.value, ctx.map.value] as const,
  ([marker, map]) => {
    if (!marker || !map || cleanup) return;

    const tooltip = create({ closeOnClick: true });

    const onEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map);
    };
    const onLeave = () => tooltip.remove();

    marker.getElement().addEventListener("mouseenter", onEnter);
    marker.getElement().addEventListener("mouseleave", onLeave);

    cleanup = () => {
      marker.getElement().removeEventListener("mouseenter", onEnter);
      marker.getElement().removeEventListener("mouseleave", onLeave);
      tooltip.remove();
    };
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <Teleport :to="container">
    <PopupShell variant="tooltip" :class="$props.class">
      <slot />
    </PopupShell>
  </Teleport>
</template>
