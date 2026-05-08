<script setup lang="ts">
import { cn } from "@/lib/utils";
defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 px-6 pt-6', $props.class)">
    <slot />
  </div>
</template>
