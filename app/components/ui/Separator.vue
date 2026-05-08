<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{ orientation?: "horizontal" | "vertical"; class?: string }>(),
  { orientation: "horizontal" },
);

const cls = computed(() =>
  cn(
    "bg-border shrink-0",
    props.orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
    props.class,
  ),
);
</script>

<template>
  <div role="separator" :aria-orientation="orientation" :class="cls" />
</template>
