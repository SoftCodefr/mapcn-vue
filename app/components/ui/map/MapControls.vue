<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { Locate, Loader2, Maximize, Minus, Plus } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { useMap } from "./composables/use-map";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Props = {
  /** Position of the controls on the map (default: "bottom-right") */
  position?: Position;
  /** Show zoom in/out buttons (default: true) */
  showZoom?: boolean;
  /** Show compass button to reset bearing (default: false) */
  showCompass?: boolean;
  /** Show locate button to find user's location (default: false) */
  showLocate?: boolean;
  /** Show fullscreen toggle button (default: false) */
  showFullscreen?: boolean;
  /** Additional CSS classes for the controls container */
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  position: "bottom-right",
  showZoom: true,
  showCompass: false,
  showLocate: false,
  showFullscreen: false,
});

const emit = defineEmits<{
  locate: [coords: { longitude: number; latitude: number }];
}>();

const { map } = useMap();
const waitingForLocation = ref(false);
const compassRef = useTemplateRef<SVGSVGElement>("compass");

const positionClasses: Record<Position, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

const containerClass = computed(() =>
  cn(
    "absolute z-10 flex flex-col gap-1.5",
    positionClasses[props.position],
    props.class,
  ),
);

const handleZoomIn = () => map.value?.zoomTo(map.value.getZoom() + 1, { duration: 300 });
const handleZoomOut = () => map.value?.zoomTo(map.value.getZoom() - 1, { duration: 300 });
const handleResetBearing = () => map.value?.resetNorthPitch({ duration: 300 });

const handleLocate = () => {
  waitingForLocation.value = true;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        };
        map.value?.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: 14,
          duration: 1500,
        });
        emit("locate", coords);
        waitingForLocation.value = false;
      },
      (error) => {
        console.error("Error getting location:", error);
        waitingForLocation.value = false;
      },
    );
  }
};

const handleFullscreen = () => {
  const container = map.value?.getContainer();
  if (!container) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.requestFullscreen();
  }
};

let cleanupCompass: (() => void) | null = null;

watch(
  [map, () => props.showCompass, compassRef],
  ([m, showCompass, compass]) => {
    cleanupCompass?.();
    cleanupCompass = null;
    if (!m || !showCompass || !compass) return;

    const update = () => {
      const bearing = m.getBearing();
      const pitch = m.getPitch();
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
    };
    m.on("rotate", update);
    m.on("pitch", update);
    update();
    cleanupCompass = () => {
      m.off("rotate", update);
      m.off("pitch", update);
    };
  },
);

onBeforeUnmount(() => {
  cleanupCompass?.();
});

const buttonClass =
  "flex size-8 items-center justify-center transition-all first:rounded-t-md last:rounded-b-md hover:bg-accent dark:hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50";

const groupClass =
  "border-border bg-background flex flex-col overflow-hidden rounded-md border shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-border";
</script>

<template>
  <div :class="containerClass">
    <div v-if="showZoom" :class="groupClass">
      <button
        type="button"
        :class="buttonClass"
        aria-label="Zoom in"
        @click="handleZoomIn"
      >
        <Plus class="size-4" />
      </button>
      <button
        type="button"
        :class="buttonClass"
        aria-label="Zoom out"
        @click="handleZoomOut"
      >
        <Minus class="size-4" />
      </button>
    </div>

    <div v-if="showCompass" :class="groupClass">
      <button
        type="button"
        :class="buttonClass"
        aria-label="Reset bearing to north"
        @click="handleResetBearing"
      >
        <svg
          ref="compass"
          viewBox="0 0 24 24"
          class="size-5 transition-transform duration-200"
          style="transform-style: preserve-3d"
        >
          <path d="M12 2L16 12H12V2Z" class="fill-red-500" />
          <path d="M12 2L8 12H12V2Z" class="fill-red-300" />
          <path d="M12 22L16 12H12V22Z" class="fill-muted-foreground/60" />
          <path d="M12 22L8 12H12V22Z" class="fill-muted-foreground/30" />
        </svg>
      </button>
    </div>

    <div v-if="showLocate" :class="groupClass">
      <button
        type="button"
        :class="buttonClass"
        aria-label="Find my location"
        :disabled="waitingForLocation"
        @click="handleLocate"
      >
        <Loader2 v-if="waitingForLocation" class="size-4 animate-spin" />
        <Locate v-else class="size-4" />
      </button>
    </div>

    <div v-if="showFullscreen" :class="groupClass">
      <button
        type="button"
        :class="buttonClass"
        aria-label="Toggle fullscreen"
        @click="handleFullscreen"
      >
        <Maximize class="size-4" />
      </button>
    </div>
  </div>
</template>
