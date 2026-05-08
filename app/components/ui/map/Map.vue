<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from "vue";
import MapLibreGL, {
  type MapOptions,
  type ProjectionSpecification,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { cn } from "@/lib/utils";
import { MapContextKey } from "./context";
import { useResolvedTheme } from "./composables/use-resolved-theme";
import { getViewport } from "./utils";
import type { MapViewport, Theme } from "./types";

type MapStyleOption = string | StyleSpecification;

type MapStyles = {
  light?: MapStyleOption;
  dark?: MapStyleOption;
};

/**
 * Wrapper-only props. Native MapLibre options (center, zoom, scrollZoom,
 * interactive, ...) are passed through `$attrs` and forwarded as-is to the
 * `new MapLibreGL.Map(...)` constructor. They aren't declared here on purpose:
 * Vue's type-based defineProps coerces every optional `boolean` declaration to
 * `false` when absent, which silently disables MapLibre interactions.
 */
type Props = {
  /** Additional CSS classes for the map container */
  class?: string;
  /**
   * Theme for the map. If not provided, automatically detects system preference
   * (and watches `.dark` / `.light` class on `<html>`).
   */
  theme?: Theme;
  /** Custom map styles for light and dark themes. Overrides the default Carto styles. */
  styles?: MapStyles;
  /** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
  projection?: ProjectionSpecification;
  /**
   * Controlled viewport. Combined with `update:viewport` event, the map
   * becomes controlled (use `v-model:viewport`).
   */
  viewport?: Partial<MapViewport>;
  /** Show a loading indicator on the map */
  loading?: boolean;
};

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const attrs = useAttrs();

const emit = defineEmits<{
  "update:viewport": [viewport: MapViewport];
}>();

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const containerRef = useTemplateRef<HTMLDivElement>("container");
const mapInstance = shallowRef<MapLibreGL.Map | null>(null);
const isLoaded = ref(false);
const isStyleLoaded = ref(false);

const resolvedTheme = useResolvedTheme(() => props.theme);

const isControlled = computed(() => props.viewport !== undefined);

const mapStyles = computed<Required<MapStyles>>(() => ({
  dark: props.styles?.dark ?? defaultStyles.dark,
  light: props.styles?.light ?? defaultStyles.light,
}));

const containerClass = computed(() =>
  cn("relative h-full w-full", props.class),
);

let currentStyle: MapStyleOption | null = null;
let styleTimeout: ReturnType<typeof setTimeout> | null = null;
let internalUpdate = false; // Re-entrancy flag for controlled-viewport sync.

const clearStyleTimeout = () => {
  if (styleTimeout) {
    clearTimeout(styleTimeout);
    styleTimeout = null;
  }
};

const isLoadedAndStyleLoaded = computed(
  () => isLoaded.value && isStyleLoaded.value,
);

provide(MapContextKey, {
  map: mapInstance,
  isLoaded: isLoadedAndStyleLoaded,
});

defineExpose({
  /** The underlying MapLibre map instance (null until mounted). */
  map: mapInstance,
});

const RESERVED_ATTR_KEYS = new Set(["class", "style", "container"]);

const collectMapOptions = (): Partial<MapOptions> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined) continue;
    // Skip Vue event listeners (e.g. onClick) — they aren't MapLibre options.
    if (/^on[A-Z]/.test(key)) continue;
    if (RESERVED_ATTR_KEYS.has(key)) continue;
    out[key] = value;
  }
  // Merge controlled viewport last so it overrides any duplicate attrs.
  for (const [key, value] of Object.entries(props.viewport ?? {})) {
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<MapOptions>;
};

onMounted(() => {
  if (!containerRef.value) return;

  const initialStyle =
    resolvedTheme.value === "dark"
      ? mapStyles.value.dark
      : mapStyles.value.light;
  currentStyle = initialStyle;

  const map = new MapLibreGL.Map({
    container: containerRef.value,
    style: initialStyle,
    renderWorldCopies: false,
    attributionControl: { compact: true },
    ...collectMapOptions(),
  });

  const styleDataHandler = () => {
    clearStyleTimeout();
    styleTimeout = setTimeout(() => {
      isStyleLoaded.value = true;
      if (props.projection) {
        map.setProjection(props.projection);
      }
    }, 100);
  };
  const loadHandler = () => {
    isLoaded.value = true;
  };
  const handleMove = () => {
    if (internalUpdate) return;
    emit("update:viewport", getViewport(map));
  };

  map.on("load", loadHandler);
  map.on("styledata", styleDataHandler);
  map.on("move", handleMove);
  mapInstance.value = map;
});

onBeforeUnmount(() => {
  clearStyleTimeout();
  const map = mapInstance.value;
  if (map) {
    map.remove();
  }
  mapInstance.value = null;
  isLoaded.value = false;
  isStyleLoaded.value = false;
});

// Sync controlled viewport to map
watch(
  () => props.viewport,
  (next) => {
    const map = mapInstance.value;
    if (!map || !isControlled.value || !next) return;
    if (map.isMoving()) return;

    const current = getViewport(map);
    const target = {
      center: next.center ?? current.center,
      zoom: next.zoom ?? current.zoom,
      bearing: next.bearing ?? current.bearing,
      pitch: next.pitch ?? current.pitch,
    };

    if (
      target.center[0] === current.center[0] &&
      target.center[1] === current.center[1] &&
      target.zoom === current.zoom &&
      target.bearing === current.bearing &&
      target.pitch === current.pitch
    ) {
      return;
    }

    internalUpdate = true;
    map.jumpTo(target);
    internalUpdate = false;
  },
  { deep: true },
);

// Handle style change (theme switch / styles prop change)
watch([resolvedTheme, mapStyles], ([theme, styles]) => {
  const map = mapInstance.value;
  if (!map) return;

  const newStyle = theme === "dark" ? styles.dark : styles.light;
  if (currentStyle === newStyle) return;

  clearStyleTimeout();
  currentStyle = newStyle;
  isStyleLoaded.value = false;
  map.setStyle(newStyle, { diff: true });
});

// Sync projection if it changes after mount
watch(
  () => props.projection,
  (next) => {
    const map = mapInstance.value;
    if (!map || !next) return;
    map.setProjection(next);
  },
);
</script>

<template>
  <div ref="container" :class="containerClass">
    <div
      v-if="!isLoaded || loading"
      class="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs"
    >
      <div class="flex gap-1">
        <span
          class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full"
        />
        <span
          class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]"
        />
        <span
          class="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]"
        />
      </div>
    </div>
    <slot v-if="mapInstance" />
  </div>
</template>
