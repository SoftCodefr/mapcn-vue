<script setup lang="ts">
import { Mountain, RotateCcw } from "lucide-vue-next";

const { map, isLoaded } = useMap();
const pitch = ref(0);
const bearing = ref(0);

let cleanup: (() => void) | null = null;

watch([map, isLoaded], ([m, loaded]) => {
  cleanup?.();
  cleanup = null;
  if (!m || !loaded) return;
  const handleMove = () => {
    pitch.value = Math.round(m.getPitch());
    bearing.value = Math.round(m.getBearing());
  };
  m.on("move", handleMove);
  cleanup = () => m.off("move", handleMove);
});

onBeforeUnmount(() => cleanup?.());

const handle3DView = () => {
  map.value?.easeTo({ pitch: 60, bearing: -20, duration: 1000 });
};
const handleReset = () => {
  map.value?.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
};
</script>

<template>
  <div v-if="isLoaded" class="absolute top-3 left-3 z-10 flex flex-col gap-2">
    <div class="flex gap-2">
      <button
        type="button"
        class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors"
        @click="handle3DView"
      >
        <Mountain class="size-4" />
        3D View
      </button>
      <button
        type="button"
        class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors"
        @click="handleReset"
      >
        <RotateCcw class="size-4" />
        Reset
      </button>
    </div>
    <div
      class="bg-background/90 rounded-md border px-3 py-2 font-mono text-xs backdrop-blur"
    >
      <div>Pitch: {{ pitch }}°</div>
      <div>Bearing: {{ bearing }}°</div>
    </div>
  </div>
</template>
