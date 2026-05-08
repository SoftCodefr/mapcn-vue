<script
  setup
  lang="ts"
  generic="P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties"
>
import { useId, watch } from "vue";
import type {
  GeoJSONSource,
  MapGeoJSONFeature,
  MapMouseEvent,
} from "maplibre-gl";
import { useMap } from "./composables/use-map";
import { useMapLayer } from "./composables/use-map-layer";

type Props = {
  /** GeoJSON FeatureCollection or URL to fetch GeoJSON from */
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  /** Maximum zoom level to cluster points on (default: 14) */
  clusterMaxZoom?: number;
  /** Cluster radius in pixels (default: 50) */
  clusterRadius?: number;
  /** Colors for cluster circles: [small, medium, large] */
  clusterColors?: [string, string, string];
  /** Point count thresholds for color/size steps: [medium, large] (default: [100, 750]) */
  clusterThresholds?: [number, number];
  /** Color for unclustered individual points (default: "#3b82f6") */
  pointColor?: string;
  /**
   * If `true`, the default behavior on cluster click (zoom into the cluster)
   * is suppressed and only the `clusterClick` event is emitted (default: false).
   */
  manualClusterClick?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  clusterMaxZoom: 14,
  clusterRadius: 50,
  clusterColors: () => ["#22c55e", "#eab308", "#ef4444"],
  clusterThresholds: () => [100, 750],
  pointColor: "#3b82f6",
  manualClusterClick: false,
});

const emit = defineEmits<{
  pointClick: [
    feature: GeoJSON.Feature<GeoJSON.Point, P>,
    coordinates: [number, number],
  ];
  clusterClick: [
    clusterId: number,
    coordinates: [number, number],
    pointCount: number,
  ];
}>();

const { map, isLoaded } = useMap();
const id = useId();
const sourceId = `cluster-source-${id}`;
const clusterLayerId = `clusters-${id}`;
const clusterCountLayerId = `cluster-count-${id}`;
const unclusteredLayerId = `unclustered-point-${id}`;

useMapLayer(map, isLoaded, (m) => {
  m.addSource(sourceId, {
    type: "geojson",
    data: props.data,
    cluster: true,
    clusterMaxZoom: props.clusterMaxZoom,
    clusterRadius: props.clusterRadius,
  });

  m.addLayer({
    id: clusterLayerId,
    type: "circle",
    source: sourceId,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        props.clusterColors[0],
        props.clusterThresholds[0],
        props.clusterColors[1],
        props.clusterThresholds[1],
        props.clusterColors[2],
      ],
      "circle-radius": [
        "step",
        ["get", "point_count"],
        20,
        props.clusterThresholds[0],
        30,
        props.clusterThresholds[1],
        40,
      ],
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
      "circle-opacity": 0.85,
    },
  });

  m.addLayer({
    id: clusterCountLayerId,
    type: "symbol",
    source: sourceId,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Open Sans"],
      "text-size": 12,
    },
    paint: { "text-color": "#fff" },
  });

  m.addLayer({
    id: unclusteredLayerId,
    type: "circle",
    source: sourceId,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": props.pointColor,
      "circle-radius": 5,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fff",
    },
  });

  const onClusterClick = async (
    e: MapMouseEvent & { features?: MapGeoJSONFeature[] },
  ) => {
    const features = m.queryRenderedFeatures(e.point, {
      layers: [clusterLayerId],
    });
    if (!features.length) return;
    const feature = features[0];
    const clusterId = feature.properties?.cluster_id as number;
    const pointCount = feature.properties?.point_count as number;
    const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
      number,
      number,
    ];

    emit("clusterClick", clusterId, coordinates, pointCount);

    if (!props.manualClusterClick) {
      const source = m.getSource(sourceId) as GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(clusterId);
      m.easeTo({ center: coordinates, zoom });
    }
  };

  const onPointClick = (
    e: MapMouseEvent & { features?: MapGeoJSONFeature[] },
  ) => {
    if (!e.features?.length) return;
    const feature = e.features[0];
    const coordinates = (
      feature.geometry as GeoJSON.Point
    ).coordinates.slice() as [number, number];

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    emit(
      "pointClick",
      feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
      coordinates,
    );
  };

  const setPointer = () => {
    m.getCanvas().style.cursor = "pointer";
  };
  const clearPointer = () => {
    m.getCanvas().style.cursor = "";
  };

  m.on("click", clusterLayerId, onClusterClick);
  m.on("click", unclusteredLayerId, onPointClick);
  m.on("mouseenter", clusterLayerId, setPointer);
  m.on("mouseleave", clusterLayerId, clearPointer);
  m.on("mouseenter", unclusteredLayerId, setPointer);
  m.on("mouseleave", unclusteredLayerId, clearPointer);

  return () => {
    m.off("click", clusterLayerId, onClusterClick);
    m.off("click", unclusteredLayerId, onPointClick);
    m.off("mouseenter", clusterLayerId, setPointer);
    m.off("mouseleave", clusterLayerId, clearPointer);
    m.off("mouseenter", unclusteredLayerId, setPointer);
    m.off("mouseleave", unclusteredLayerId, clearPointer);
    try {
      if (m.getLayer(clusterCountLayerId)) m.removeLayer(clusterCountLayerId);
      if (m.getLayer(unclusteredLayerId)) m.removeLayer(unclusteredLayerId);
      if (m.getLayer(clusterLayerId)) m.removeLayer(clusterLayerId);
      if (m.getSource(sourceId)) m.removeSource(sourceId);
    } catch {
      // already removed by setStyle
    }
  };
});

watch(
  () => props.data,
  (next) => {
    if (typeof next === "string") return;
    const src = map.value?.getSource(sourceId) as GeoJSONSource | undefined;
    src?.setData(next);
  },
  { deep: true },
);

watch(
  [() => props.clusterColors, () => props.clusterThresholds],
  ([colors, thresholds]) => {
    const m = map.value;
    if (!m?.getLayer(clusterLayerId)) return;
    m.setPaintProperty(clusterLayerId, "circle-color", [
      "step",
      ["get", "point_count"],
      colors[0],
      thresholds[0],
      colors[1],
      thresholds[1],
      colors[2],
    ]);
    m.setPaintProperty(clusterLayerId, "circle-radius", [
      "step",
      ["get", "point_count"],
      20,
      thresholds[0],
      30,
      thresholds[1],
      40,
    ]);
  },
  { deep: true },
);

watch(
  () => props.pointColor,
  (next) => {
    const m = map.value;
    if (!m?.getLayer(unclusteredLayerId)) return;
    m.setPaintProperty(unclusteredLayerId, "circle-color", next);
  },
);
</script>

<template></template>
