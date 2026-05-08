<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";
import { Toggle } from "@/components/ui/toggle";

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
  <Toggle
    aria-label="Toggle theme"
    class="hover:bg-accent bg-background inline-flex size-8 items-center justify-center rounded-md transition-colors"
    @click="toggle"
  >
    <Moon v-if="mode === 'dark'" class="size-4" />
    <Sun v-else class="size-4" />
  </Toggle>
</template>
