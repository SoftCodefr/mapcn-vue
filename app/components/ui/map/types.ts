import type {
  Map as MapLibreMap,
  LineLayerSpecification,
  MapMouseEvent,
} from "maplibre-gl";

export type Theme = "light" | "dark";

/** Map viewport state */
export type MapViewport = {
  /** Center coordinates [longitude, latitude] */
  center: [number, number];
  /** Zoom level */
  zoom: number;
  /** Bearing (rotation) in degrees */
  bearing: number;
  /** Pitch (tilt) in degrees */
  pitch: number;
};

/** Underlying MapLibre map instance, exposed via template ref. */
export type MapRef = MapLibreMap;

/** A single arc to render inside <MapArc :data="..." />. */
export type MapArcDatum = {
  /** Unique identifier for this arc. Required for hover state tracking and event payloads. */
  id: string | number;
  /** Start coordinate as [longitude, latitude]. */
  from: [number, number];
  /** End coordinate as [longitude, latitude]. */
  to: [number, number];
};

/** Event payload passed to MapArc interaction callbacks. */
export type MapArcEvent<T extends MapArcDatum = MapArcDatum> = {
  /** The arc datum that was hovered or clicked. */
  arc: T;
  /** Longitude of the cursor at the time of the event. */
  longitude: number;
  /** Latitude of the cursor at the time of the event. */
  latitude: number;
  /** The underlying MapLibre mouse event for advanced use cases. */
  originalEvent: MapMouseEvent;
};

export type MapArcLinePaint = NonNullable<LineLayerSpecification["paint"]>;
export type MapArcLineLayout = NonNullable<LineLayerSpecification["layout"]>;
