<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "destructive";

const props = withDefaults(
  defineProps<{ variant?: Variant; class?: string }>(),
  { variant: "default" },
);

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const cls = computed(() =>
  cn(
    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
    variantClasses[props.variant],
    props.class,
  ),
);
</script>

<template>
  <span :class="cls">
    <slot />
  </span>
</template>
