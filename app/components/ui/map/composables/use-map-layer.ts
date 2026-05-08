import { onBeforeUnmount, watch, type Ref } from "vue";
import type { Map as MapLibreMap } from "maplibre-gl";

export type LayerSetup = (map: MapLibreMap) => void | (() => void);

/**
 * Manages a custom MapLibre layer's lifecycle within a `<Map>`:
 * - Calls `setup` once the map is fully loaded.
 * - On theme switch, MapLibre's `setStyle` wipes our layers/sources but
 *   keeps our delegated event listeners. The composable tears down the
 *   previous setup (so cleanup can `map.off(...)` the stale listeners) and
 *   re-runs `setup` once the new style is loaded.
 * - Cleans up on unmount.
 *
 * `setup` may return a cleanup function. Removal of layers/sources should
 * be wrapped in try/catch (or guarded with `getLayer`/`getSource`) since
 * `setStyle` may have already removed them when cleanup runs.
 */
export function useMapLayer(
  map: Ref<MapLibreMap | null>,
  isLoaded: Ref<boolean>,
  setup: LayerSetup,
) {
  let cleanup: (() => void) | null = null;

  const teardown = () => {
    cleanup?.();
    cleanup = null;
  };

  watch(
    [map, isLoaded],
    ([m, loaded]) => {
      if (!m) {
        teardown();
        return;
      }
      if (loaded) {
        if (cleanup) return;
        const ret = setup(m);
        cleanup = typeof ret === "function" ? ret : null;
      } else {
        // setStyle wiped the style. Run cleanup so any `map.on(layerId, ...)`
        // delegated listeners get unregistered (they survive setStyle and
        // would otherwise accumulate across theme toggles).
        teardown();
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(teardown);
}
