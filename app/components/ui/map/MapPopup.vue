<script setup lang="ts">
import { watch } from "vue";
import type { PopupOptions } from "maplibre-gl";
import { useMap } from "./composables/use-map";
import { usePopup } from "./composables/use-popup";
import PopupShell from "./PopupShell.vue";

type Props = {
  /** Longitude coordinate for popup position */
  longitude: number;
  /** Latitude coordinate for popup position */
  latitude: number;
  /** Additional CSS classes for the popup container */
  class?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

const props = withDefaults(defineProps<Props>(), {
  closeButton: false,
  offset: 16,
});

const emit = defineEmits<{ close: [] }>();

const { map } = useMap();
const { container, popup, create } = usePopup(() => props);

watch(
  map,
  (m) => {
    if (!m || popup.value) return;
    const p = create();
    p.setLngLat([props.longitude, props.latitude]);
    p.on("close", () => emit("close"));
    p.addTo(m);
  },
  { immediate: true },
);

watch(
  () => [props.longitude, props.latitude] as const,
  ([lng, lat]) => {
    const p = popup.value;
    if (!p?.isOpen()) return;
    if (p.getLngLat().lng !== lng || p.getLngLat().lat !== lat) {
      p.setLngLat([lng, lat]);
    }
  },
);
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
