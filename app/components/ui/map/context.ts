import type { InjectionKey, Ref } from "vue";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

export type MapContextValue = {
  map: Ref<MapLibreMap | null>;
  isLoaded: Ref<boolean>;
};

export const MapContextKey: InjectionKey<MapContextValue> = Symbol("MapContext");

export type MarkerContextValue = {
  marker: Ref<MapLibreMarker | null>;
  map: Ref<MapLibreMap | null>;
};

export const MarkerContextKey: InjectionKey<MarkerContextValue> =
  Symbol("MarkerContext");
