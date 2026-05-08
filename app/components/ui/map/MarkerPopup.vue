<script setup lang="ts">
import { inject, onBeforeUnmount, watch } from "vue";
import type { PopupOptions } from "maplibre-gl";
import { MarkerContextKey } from "./context";
import { usePopup } from "./composables/use-popup";
import PopupShell from "./PopupShell.vue";

type Props = {
  /** Additional CSS classes for the popup container */
  class?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

const props = withDefaults(defineProps<Props>(), {
  closeButton: false,
  offset: 16,
});

const ctx = inject(MarkerContextKey, null);
if (!ctx) {
  throw new Error("MarkerPopup must be used within a MapMarker component");
}

const { container, popup, create } = usePopup(() => props);

watch(
  () => [ctx.marker.value, ctx.map.value] as const,
  ([marker, map]) => {
    if (!marker || !map || popup.value) return;
    marker.setPopup(create());
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  ctx.marker.value?.setPopup(null);
});
</script>

<template>
  <Teleport :to="container">
    <PopupShell
      variant="popover"
      :close-button="closeButton"
      :class="$props.class"
      @close="popup?.remove()"
    >
      <slot />
    </PopupShell>
  </Teleport>
</template>
