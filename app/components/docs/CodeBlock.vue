<script setup lang="ts">
import { highlightCode } from "@/lib/highlight";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    showCopyButton?: boolean;
  }>(),
  { language: "vue", showCopyButton: true },
);

// Render Shiki at SSR time so the highlighted HTML ships with the initial
// payload. Re-keyed on the language so multi-language pages dedupe correctly.
const { data: highlighted } = await useAsyncData(
  `shiki:${props.language}:${props.code.length}:${props.code.slice(0, 32)}`,
  () => highlightCode(props.code, props.language),
);
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-lg border">
    <div v-if="showCopyButton" class="absolute top-2 right-2 z-10">
      <CopyButton :text="code" />
    </div>
    <div
      class="bg-muted/40 overflow-auto p-4 text-sm [&_code]:bg-transparent! [&_pre]:bg-transparent!"
      v-html="highlighted ?? ''"
    />
  </div>
</template>
