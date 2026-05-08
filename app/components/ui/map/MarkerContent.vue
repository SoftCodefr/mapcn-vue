<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "@/lib/utils";
import { MarkerContextKey } from "./context";

type Props = {
  /** Additional CSS classes for the marker container */
  class?: string;
};

const props = defineProps<Props>();

const ctx = inject(MarkerContextKey, null);
if (!ctx) {
  throw new Error("MarkerContent must be used within a MapMarker component");
}

const targetEl = computed(() => ctx.marker.value?.getElement() ?? null);

const containerClass = computed(() =>
  cn("relative cursor-pointer", props.class),
);
</script>

<template>
  <Teleport v-if="targetEl" :to="targetEl">
    <div :class="containerClass">
      <slot>
        <div
          class="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"
        />
      </slot>
    </div>
  </Teleport>
</template>
