<script setup lang="ts">
import {
  getAllBlocks,
  createFileTreeForRegistryItemFiles,
} from "@/lib/blocks";
import { getBlockFileSource } from "@/lib/get-block-source";
import { highlightCode } from "@/lib/highlight";
import type { HighlightedFile } from "./BlockViewerCode.vue";

const props = defineProps<{ name: string }>();

const block = computed(() =>
  getAllBlocks().find((b) => b.name === props.name),
);

const tree = computed(() =>
  block.value?.files
    ? createFileTreeForRegistryItemFiles(block.value.files)
    : [],
);

// Highlight every file's source at SSR time so the code panel paints with
// theme-aware tokens in the initial response.
const { data: highlightedFiles } = await useAsyncData(
  () => `block:${props.name}`,
  async (): Promise<HighlightedFile[]> => {
    if (!block.value?.files) return [];
    return Promise.all(
      block.value.files.map(async (file) => {
        const content = getBlockFileSource(file.path);
        const lang = file.path.endsWith(".vue")
          ? "vue"
          : (file.path.split(".").pop() ?? "ts");
        const highlightedContent = await highlightCode(content, lang);
        return {
          path: file.path,
          target: file.target ?? file.path,
          content,
          highlightedContent,
        };
      }),
    );
  },
);
</script>

<template>
  <div v-if="block">
    <BlockPreview
      :block="block"
      :tree="tree"
      :highlighted-files="highlightedFiles ?? []"
    >
      <IframePreview
        :src="`/view/${block.name}`"
        :title="block.title ?? block.name"
      />
    </BlockPreview>
  </div>
</template>
