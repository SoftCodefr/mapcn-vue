<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps<{
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}>();
</script>

<template>
  <div
    v-if="prev || next"
    class="mt-auto flex items-center justify-between gap-4 pt-8"
  >
    <NuxtLink
      v-if="prev"
      :to="prev.href"
      class="text-muted-foreground hover:bg-accent hover:text-foreground -ml-2 inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-medium transition-colors"
    >
      <ChevronLeft class="size-4" />
      {{ prev.title }}
    </NuxtLink>
    <span v-else />

    <NuxtLink
      v-if="next"
      :to="next.href"
      class="text-muted-foreground hover:bg-accent hover:text-foreground -mr-2 inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-medium transition-colors"
    >
      {{ next.title }}
      <ChevronRight class="size-4" />
    </NuxtLink>
  </div>
</template>
