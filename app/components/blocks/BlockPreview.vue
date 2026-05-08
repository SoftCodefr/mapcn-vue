<script setup lang="ts">
import { Check, Fullscreen, Terminal } from "lucide-vue-next";
import type { RegistryBlockItem, FileTree } from "@/lib/blocks";
import type { HighlightedFile } from "./BlockViewerCode.vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  block: RegistryBlockItem;
  tree: FileTree[];
  highlightedFiles: HighlightedFile[];
}>();

const activeTab = ref<"preview" | "code">("preview");
const copiedCli = ref(false);

const cliCommand = computed(
  () =>
    `npx shadcn-vue@latest add https://mapcn-vue.com/r/${props.block.name}.json`,
);

const onCopyCli = async () => {
  await navigator.clipboard.writeText(cliCommand.value);
  copiedCli.value = true;
  setTimeout(() => (copiedCli.value = false), 2000);
};

const previewHeight = computed(() => props.block.meta?.iframeHeight ?? "930px");

const tabBtn = (active: boolean) =>
  cn(
    "inline-flex h-6 items-center justify-center rounded-sm px-2.5 text-xs font-medium transition-all",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
    active
      ? "bg-background text-foreground shadow-sm"
      : "hover:text-foreground",
  );
</script>

<template>
  <div class="space-y-4" :style="{ '--block-preview-height': previewHeight }">
    <div>
      <h2 class="text-foreground text-xl font-semibold tracking-tight">
        {{ block.title }}
      </h2>
      <p v-if="block.description" class="text-muted-foreground mt-1 text-sm">
        {{ block.description }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-3">
      <!-- Tab triggers -->
      <div
        role="tablist"
        class="bg-muted text-muted-foreground inline-flex h-8 items-center rounded-md p-1"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'preview'"
          :class="tabBtn(activeTab === 'preview')"
          @click="activeTab = 'preview'"
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'code'"
          :class="tabBtn(activeTab === 'code')"
          @click="activeTab = 'code'"
        >
          Code
        </button>
      </div>

      <!-- Right-side toolbar: open-in-new-tab + CLI copy -->
      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink
          :to="`/view/${block.name}`"
          target="_blank"
          aria-label="Open in new tab"
          class="border-border bg-background hover:bg-accent inline-flex size-8 items-center justify-center rounded-md border"
        >
          <Fullscreen class="size-4" />
        </NuxtLink>
      </div>
    </div>

    <div v-show="activeTab === 'preview'">
      <slot />
    </div>
    <div v-show="activeTab === 'code'">
      <BlockViewerCode :tree="tree" :highlighted-files="highlightedFiles" />
    </div>
  </div>
</template>
