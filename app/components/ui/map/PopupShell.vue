<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

type Props = {
  /** Visual variant: "popover" (rounded card) or "tooltip" (compact, dark). */
  variant?: "popover" | "tooltip";
  /** Render a close button in the top-right corner (popover variant only). */
  closeButton?: boolean;
  /** Additional CSS classes. */
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "popover",
  closeButton: false,
});

defineEmits<{ close: [] }>();

const cls = computed(() =>
  props.variant === "tooltip"
    ? cn(
        "bg-foreground text-background pointer-events-none rounded-md px-2 py-1 text-xs text-balance shadow-md",
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        props.class,
      )
    : cn(
        "bg-popover text-popover-foreground relative max-w-62 rounded-md border p-3 shadow-md",
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        props.class,
      ),
);
</script>

<template>
  <div :class="cls">
    <button
      v-if="variant === 'popover' && closeButton"
      type="button"
      aria-label="Close popup"
      class="focus-visible:ring-ring hover:bg-muted text-foreground absolute top-0.5 right-0.5 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-2"
      @click="$emit('close')"
    >
      <X class="size-3.5" />
    </button>
    <slot />
  </div>
</template>
