<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: string }>();

const cls = computed(() =>
  cn(
    "bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm",
    props.class,
  ),
);
</script>

<template>
  <code :class="cls"><slot /></code>
</template>
