<script setup lang="ts" generic="T extends MapArcDatum = MapArcDatum">
import { computed, useId, watch } from "vue";
import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useMap } from "./composables/use-map";
import { useMapLayer } from "./composables/use-map-layer";
import { buildArcCoordinates, mergeArcPaint } from "./utils";
import type {
  MapArcDatum,
  MapArcEvent,
  MapArcLineLayout,
  MapArcLinePaint,
} from "./types";

type Props = {
  /** Array of arcs to render. Each arc must have a unique `id`. */
  data: T[];
  /** Optional unique identifier prefix for the arc source/layers. */
  id?: string;
  /**
   * How far each arc bows away from a straight line. `0` renders straight
   * lines; higher values bend further. Negative values bend to the
   * opposite side. (default: 0.2)
   */
  curvature?: number;
  /** Number of samples used to render each curve. Higher = smoother. (default: 64) */
  samples?: number;
  /** MapLibre paint properties for the arc layer. */
  paint?: MapArcLinePaint;
  /** MapLibre layout properties for the arc layer. */
  layout?: MapArcLineLayout;
  /** Paint applied to the hovered arc only. */
  hoverPaint?: MapArcLinePaint;
  /** Whether arcs respond to mouse events (default: true). */
  interactive?: boolean;
  /** MapLibre layer id to insert the arc layers before (z-order control). */
  beforeId?: string;
};

const props = withDefaults(defineProps<Props>(), {
  curvature: 0.2,
  samples: 64,
  interactive: true,
});

const emit = defineEmits<{
  click: [event: MapArcEvent<T>];
  hover: [event: MapArcEvent<T> | null];
}>();

const DEFAULT_ARC_PAINT: MapArcLinePaint = {
  "line-color": "#4285F4",
  "line-width": 2,
  "line-opacity": 0.85,
};

const DEFAULT_ARC_LAYOUT: MapArcLineLayout = {
  "line-join": "round",
  "line-cap": "round",
};

const ARC_HIT_MIN_WIDTH = 12;
const ARC_HIT_PADDING = 6;

const { map, isLoaded } = useMap();
const autoId = useId();
const baseId = props.id ?? autoId;
const sourceId = `arc-source-${baseId}`;
const layerId = `arc-layer-${baseId}`;
const hitLayerId = `arc-hit-layer-${baseId}`;

const mergedPaint = computed<MapArcLinePaint>(() =>
  mergeArcPaint({ ...DEFAULT_ARC_PAINT, ...props.paint }, props.hoverPaint),
);

const mergedLayout = computed<MapArcLineLayout>(() => ({
  ...DEFAULT_ARC_LAYOUT,
  ...props.layout,
}));

const hitWidth = computed(() => {
  const w = props.paint?.["line-width"] ?? DEFAULT_ARC_PAINT["line-width"];
  const base = typeof w === "number" ? w : ARC_HIT_MIN_WIDTH;
  return Math.max(base + ARC_HIT_PADDING, ARC_HIT_MIN_WIDTH);
});

const geoJSON = computed<GeoJSON.FeatureCollection<GeoJSON.LineString>>(() => ({
  type: "FeatureCollection",
  features: props.data.map((arc) => {
    const { from, to, ...properties } = arc;
    return {
      type: "Feature",
      properties,
      geometry: {
        type: "LineString",
        coordinates: buildArcCoordinates(from, to, props.curvature, props.samples),
      },
    };
  }),
}));

useMapLayer(map, isLoaded, (m) => {
  m.addSource(sourceId, {
    type: "geojson",
    data: geoJSON.value,
    promoteId: "id",
  });

  m.addLayer(
    {
      id: hitLayerId,
      type: "line",
      source: sourceId,
      layout: DEFAULT_ARC_LAYOUT,
      paint: {
        "line-color": "rgba(0, 0, 0, 0)",
        "line-width": hitWidth.value,
        "line-opacity": 1,
      },
    },
    props.beforeId,
  );

  m.addLayer(
    {
      id: layerId,
      type: "line",
      source: sourceId,
      layout: mergedLayout.value,
      paint: mergedPaint.value,
    },
    props.beforeId,
  );

  let hoveredId: string | number | null = null;
  const setHover = (next: string | number | null) => {
    if (next === hoveredId) return;
    if (hoveredId != null && m.getSource(sourceId)) {
      m.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
    }
    hoveredId = next;
    if (next != null && m.getSource(sourceId)) {
      m.setFeatureState({ source: sourceId, id: next }, { hover: true });
    }
  };

  const findArc = (featureId: string | number | undefined) =>
    featureId == null
      ? undefined
      : props.data.find((arc) => String(arc.id) === String(featureId));

  const onMove = (e: MapLayerMouseEvent) => {
    const featureId = e.features?.[0]?.id as string | number | undefined;
    if (featureId == null || featureId === hoveredId) return;
    setHover(featureId);
    m.getCanvas().style.cursor = "pointer";
    const arc = findArc(featureId);
    if (arc) {
      emit("hover", {
        arc,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        originalEvent: e,
      });
    }
  };
  const onLeave = () => {
    setHover(null);
    m.getCanvas().style.cursor = "";
    emit("hover", null);
  };
  const onClick = (e: MapLayerMouseEvent) => {
    const arc = findArc(e.features?.[0]?.id as string | number | undefined);
    if (!arc) return;
    emit("click", {
      arc,
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      originalEvent: e,
    });
  };

  if (props.interactive) {
    m.on("mousemove", hitLayerId, onMove);
    m.on("mouseleave", hitLayerId, onLeave);
    m.on("click", hitLayerId, onClick);
  }

  return () => {
    if (props.interactive) {
      m.off("mousemove", hitLayerId, onMove);
      m.off("mouseleave", hitLayerId, onLeave);
      m.off("click", hitLayerId, onClick);
      setHover(null);
      m.getCanvas().style.cursor = "";
    }
    try {
      if (m.getLayer(layerId)) m.removeLayer(layerId);
      if (m.getLayer(hitLayerId)) m.removeLayer(hitLayerId);
      if (m.getSource(sourceId)) m.removeSource(sourceId);
    } catch {
      // already removed by setStyle
    }
  };
});

watch(geoJSON, (next) => {
  const src = map.value?.getSource(sourceId) as GeoJSONSource | undefined;
  src?.setData(next);
});

watch(
  [mergedPaint, mergedLayout, hitWidth],
  ([paint, layout, hw]) => {
    const m = map.value;
    if (!m?.getLayer(layerId)) return;
    for (const [key, value] of Object.entries(paint)) {
      m.setPaintProperty(layerId, key as keyof MapArcLinePaint, value as never);
    }
    for (const [key, value] of Object.entries(layout)) {
      m.setLayoutProperty(layerId, key as keyof MapArcLineLayout, value as never);
    }
    if (m.getLayer(hitLayerId)) {
      m.setPaintProperty(hitLayerId, "line-width", hw);
    }
  },
);
</script>

<template></template>
