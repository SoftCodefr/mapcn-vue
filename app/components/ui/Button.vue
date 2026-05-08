<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon-sm" | "icon-md";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    class?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  { variant: "default", size: "md", type: "button", disabled: false },
);

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  "icon-sm": "size-8",
  "icon-md": "size-9",
};

const cls = computed(() =>
  cn(
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class,
  ),
);
</script>

<template>
  <button :type="type" :class="cls" :disabled="disabled" :aria-label="ariaLabel">
    <slot />
  </button>
</template>
