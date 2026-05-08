<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  useAttrs,
  watch,
  watchEffect,
} from "vue";
import MapLibreGL, { type MarkerOptions } from "maplibre-gl";

import { useMap } from "./composables/use-map";
import { MarkerContextKey } from "./context";

/**
 * Wrapper-only props. Other MarkerOptions (anchor, color, scale, draggable,
 * subpixelPositioning, …) flow through `$attrs` — they'd otherwise hit Vue's
 * Boolean-prop coercion and get silently set to `false`. See Map.vue for the
 * same pattern + reasoning.
 */
type Props = {
  /** Longitude coordinate for marker position */
  longitude: number;
  /** Latitude coordinate for marker position */
  latitude: number;
  /** Whether the marker can be dragged (default: false) */
  draggable?: boolean;
  /** Pixel offset of the marker from its lng/lat */
  offset?: MarkerOptions["offset"];
  /** Rotation in degrees */
  rotation?: number;
  /** Rotation alignment ("auto" | "map" | "viewport") */
  rotationAlignment?: MarkerOptions["rotationAlignment"];
  /** Pitch alignment ("auto" | "map" | "viewport") */
  pitchAlignment?: MarkerOptions["pitchAlignment"];
};

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
});

const attrs = useAttrs();

const emit = defineEmits<{
  click: [e: MouseEvent];
  mouseenter: [e: MouseEvent];
  mouseleave: [e: MouseEvent];
  dragstart: [lngLat: { lng: number; lat: number }];
  drag: [lngLat: { lng: number; lat: number }];
  dragend: [lngLat: { lng: number; lat: number }];
}>();

const { map } = useMap();
const markerRef = shallowRef<MapLibreGL.Marker | null>(null);

provide(MarkerContextKey, { marker: markerRef, map });

const collectMarkerOptions = (): Partial<MarkerOptions> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined) continue;
    if (/^on[A-Z]/.test(key)) continue;
    if (key === "class" || key === "style" || key === "element") continue;
    out[key] = value;
  }
  return out as Partial<MarkerOptions>;
};

onMounted(() => {
  const marker = new MapLibreGL.Marker({
    ...collectMarkerOptions(),
    element: document.createElement("div"),
    draggable: props.draggable,
    offset: props.offset,
    rotation: props.rotation,
    rotationAlignment: props.rotationAlignment,
    pitchAlignment: props.pitchAlignment,
  }).setLngLat([props.longitude, props.latitude]);

  const el = marker.getElement();
  const onClick = (e: MouseEvent) => emit("click", e);
  const onEnter = (e: MouseEvent) => emit("mouseenter", e);
  const onLeave = (e: MouseEvent) => emit("mouseleave", e);
  el.addEventListener("click", onClick);
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);

  marker.on("dragstart", () => {
    const { lng, lat } = marker.getLngLat();
    emit("dragstart", { lng, lat });
  });
  marker.on("drag", () => {
    const { lng, lat } = marker.getLngLat();
    emit("drag", { lng, lat });
  });
  marker.on("dragend", () => {
    const { lng, lat } = marker.getLngLat();
    emit("dragend", { lng, lat });
  });

  if (map.value) marker.addTo(map.value);
  markerRef.value = marker;

  onBeforeUnmount(() => {
    el.removeEventListener("click", onClick);
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
    marker.remove();
    markerRef.value = null;
  });
});

// Late-mount: attach to map once it appears.
watch(map, (m) => {
  if (m && markerRef.value) markerRef.value.addTo(m);
});

// Reactive sync of all marker props in one effect. MapLibre's setters are
// idempotent and cheap; manual diff guards aren't worth the noise.
watchEffect(() => {
  const marker = markerRef.value;
  if (!marker) return;
  marker.setLngLat([props.longitude, props.latitude]);
  marker.setDraggable(props.draggable);
  marker.setOffset(props.offset ?? [0, 0]);
  marker.setRotation(props.rotation ?? 0);
  marker.setRotationAlignment(props.rotationAlignment ?? "auto");
  marker.setPitchAlignment(props.pitchAlignment ?? "auto");
});
</script>

<template>
  <slot />
</template>
