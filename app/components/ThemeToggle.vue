<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";

import { useColorMode } from "@vueuse/core";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";

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

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
};

watch(
  () => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== "t") {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      toggle();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  },
  { immediate: true },
);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Toggle
          aria-label="Toggle theme"
          class="hover:bg-accent bg-background inline-flex size-8 items-center justify-center rounded-md transition-colors"
          @click="toggle"
        >
          <Moon v-if="mode === 'dark'" class="size-4" />
          <Sun v-else class="size-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Theme <Kbd>T</Kbd></p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
