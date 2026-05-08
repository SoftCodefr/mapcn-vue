import { inject } from "vue";
import { MapContextKey, type MapContextValue } from "../context";

export function useMap(): MapContextValue {
  const ctx = inject(MapContextKey, null);
  if (!ctx) {
    throw new Error("useMap must be used within a Map component");
  }
  return ctx;
}
