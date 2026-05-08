<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

type Props = {
  /** Additional CSS classes for the label */
  class?: string;
  /** Position of the label relative to the marker (default: "top") */
  position?: "top" | "bottom";
};

const props = withDefaults(defineProps<Props>(), {
  position: "top",
});

const labelClass = computed(() => {
  const positionClass =
    props.position === "top" ? "bottom-full mb-1" : "top-full mt-1";
  return cn(
    "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
    "text-foreground text-[10px] font-medium",
    positionClass,
    props.class,
  );
});
</script>

<template>
  <div :class="labelClass">
    <slot />
  </div>
</template>
