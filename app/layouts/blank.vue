<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

// Sync theme from localStorage (same source as ThemeToggle)
useColorMode({
  attribute: "class",
  modes: { light: "light", dark: "dark" },
  initialValue: "light",
});
</script>

<template>
  <div class="bg-background min-h-screen">
    <slot />
  </div>
</template>
