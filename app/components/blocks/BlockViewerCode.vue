<script setup lang="ts">
import {
  Check,
  ChevronRight,
  Copy,
  File as FileIcon,
  Folder,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { FileTree } from "@/lib/blocks";

export interface HighlightedFile {
  path: string;
  target: string;
  content: string;
  highlightedContent: string;
}

const props = defineProps<{
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}>();

const activeFile = ref<string>(props.highlightedFiles[0]?.target ?? "");

watch(
  () => props.highlightedFiles,
  (files) => {
    if (!files.length) {
      activeFile.value = "";
      return;
    }

    const stillExists = files.some((f) => f.target === activeFile.value);
    if (!activeFile.value || !stillExists) {
      activeFile.value = files[0]!.target;
    }
  },
  { immediate: true },
);

const file = computed(() =>
  props.highlightedFiles.find((f) => f.target === activeFile.value),
);

const copied = ref(false);
const onCopy = async () => {
  if (!file.value) return;
  await navigator.clipboard.writeText(file.value.content);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
</script>

<template>
  <div
    v-if="file"
    class="flex h-(--block-preview-height) overflow-hidden rounded-xl border"
  >
    <!-- File-tree sidebar -->
    <aside class="bg-card w-64 shrink-0 border-r">
      <div
        class="text-muted-foreground flex h-12 items-center border-b px-4 text-sm font-medium"
      >
        Files
      </div>
      <nav class="overflow-y-auto p-2 text-sm">
        <BlockFileTreeNode
          v-for="(node, idx) in tree"
          :key="idx"
          :item="node"
          :depth="1"
          :active="activeFile"
          @select="activeFile = $event"
        />
      </nav>
    </aside>

    <!-- Active file content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <div
        class="bg-muted/40 flex h-12 shrink-0 items-center gap-2 border-b px-4 text-sm"
      >
        <span class="text-muted-foreground">{{ file.target }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:bg-accent hover:text-foreground ml-auto inline-flex size-7 items-center justify-center rounded-md transition-colors"
          aria-label="Copy file contents"
          @click="onCopy"
        >
          <Check v-if="copied" class="size-3.5" />
          <Copy v-else class="size-3.5" />
        </button>
      </div>
      <div
        :key="file.path"
        :class="
          cn(
            'bg-muted/40 flex-1 overflow-y-auto p-4 text-sm',
            '[&_code]:bg-transparent! [&_pre]:bg-transparent!',
          )
        "
        v-html="file.highlightedContent"
      />
    </div>
  </div>
</template>
