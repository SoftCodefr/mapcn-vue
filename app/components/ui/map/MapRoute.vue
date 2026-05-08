<script setup lang="ts">
import { useId, watch } from "vue";
import type { GeoJSONSource } from "maplibre-gl";
import { useMap } from "./composables/use-map";
import { useMapLayer } from "./composables/use-map-layer";

type Props = {
  /** Optional unique identifier for the route layer */
  id?: string;
  /** Array of [longitude, latitude] coordinate pairs defining the route */
  coordinates: [number, number][];
  /** Line color as CSS color value (default: "#4285F4") */
  color?: string;
  /** Line width in pixels (default: 3) */
  width?: number;
  /** Line opacity from 0 to 1 (default: 0.8) */
  opacity?: number;
  /** Dash pattern [dash length, gap length] for dashed lines */
  dashArray?: [number, number];
  /** Whether the route is interactive — shows pointer cursor on hover (default: true) */
  interactive?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  color: "#4285F4",
  width: 3,
  opacity: 0.8,
  interactive: true,
});

const emit = defineEmits<{
  click: [];
  mouseenter: [];
  mouseleave: [];
}>();

const { map, isLoaded } = useMap();
const autoId = useId();
const baseId = props.id ?? autoId;
const sourceId = `route-source-${baseId}`;
const layerId = `route-layer-${baseId}`;

const buildFeature = (coords: [number, number][]) =>
  ({
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates: coords },
  }) as const;

useMapLayer(map, isLoaded, (m) => {
  m.addSource(sourceId, { type: "geojson", data: buildFeature(props.coordinates) });
  m.addLayer({
    id: layerId,
    type: "line",
    source: sourceId,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": props.color,
      "line-width": props.width,
      "line-opacity": props.opacity,
      ...(props.dashArray && { "line-dasharray": props.dashArray }),
    },
  });

  const onClick = () => emit("click");
  const onEnter = () => {
    m.getCanvas().style.cursor = "pointer";
    emit("mouseenter");
  };
  const onLeave = () => {
    m.getCanvas().style.cursor = "";
    emit("mouseleave");
  };
  if (props.interactive) {
    m.on("click", layerId, onClick);
    m.on("mouseenter", layerId, onEnter);
    m.on("mouseleave", layerId, onLeave);
  }

  return () => {
    if (props.interactive) {
      m.off("click", layerId, onClick);
      m.off("mouseenter", layerId, onEnter);
      m.off("mouseleave", layerId, onLeave);
    }
    try {
      if (m.getLayer(layerId)) m.removeLayer(layerId);
      if (m.getSource(sourceId)) m.removeSource(sourceId);
    } catch {
      // already removed by setStyle
    }
  };
});

watch(
  () => props.coordinates,
  (coords) => {
    if (coords.length < 2) return;
    const src = map.value?.getSource(sourceId) as GeoJSONSource | undefined;
    src?.setData(buildFeature(coords));
  },
  { deep: true },
);

watch(
  () => [props.color, props.width, props.opacity, props.dashArray] as const,
  ([c, w, o, d]) => {
    const m = map.value;
    if (!m?.getLayer(layerId)) return;
    m.setPaintProperty(layerId, "line-color", c);
    m.setPaintProperty(layerId, "line-width", w);
    m.setPaintProperty(layerId, "line-opacity", o);
    if (d) m.setPaintProperty(layerId, "line-dasharray", d);
  },
);
</script>

<template></template>
