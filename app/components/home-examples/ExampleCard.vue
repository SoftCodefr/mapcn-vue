<script setup lang="ts">
import { cn } from "@/lib/utils";

type Props = {
  class?: string;
  /** Stagger index for the entrance animation (`--stagger * 100ms`). */
  stagger?: number;
};

const props = withDefaults(defineProps<Props>(), {
  stagger: 5,
});

const cls = computed(() =>
  cn(
    "bg-card border-border/50 animate-scale-in animate-stagger relative overflow-hidden rounded-xl border shadow-sm",
    props.class,
  ),
);
</script>

<template>
  <div :class="cls" :style="{ '--stagger': stagger }">
    <slot />
  </div>
</template>
