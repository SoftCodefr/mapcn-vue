<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";

// VueUse's useColorMode toggles `.dark` / `.light` on `<html>` automatically,
// which is exactly what `useResolvedTheme` in the map library listens to.
const mode = useColorMode({
  attribute: "class",
  modes: { light: "light", dark: "dark" },
  initialValue: "light",
});

const toggle = () => {
  mode.value = mode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <button
    type="button"
    aria-label="Toggle theme"
    class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors"
    @click="toggle"
  >
    <Sun v-if="mode === 'dark'" class="size-4" />
    <Moon v-else class="size-4" />
  </button>
</template>
