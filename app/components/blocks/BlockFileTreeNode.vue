<script setup lang="ts">
import { ChevronRight, File as FileIcon, Folder } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { FileTree } from "@/lib/blocks";

const props = defineProps<{
  item: FileTree;
  depth: number;
  active: string;
}>();

defineEmits<{ select: [path: string] }>();

const open = ref(true);
const indent = computed(() => `${props.depth * 0.75}rem`);
</script>

<template>
  <!-- File leaf -->
  <button
    v-if="!item.children"
    type="button"
    :class="
      cn(
        'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm whitespace-nowrap',
        'hover:bg-muted-foreground/10',
        item.path === active && 'bg-muted-foreground/15 text-foreground',
        item.path !== active && 'text-muted-foreground',
      )
    "
    :style="{ paddingLeft: indent }"
    @click="item.path && $emit('select', item.path)"
  >
    <ChevronRight class="size-3.5 invisible shrink-0" />
    <FileIcon class="size-3.5 shrink-0" />
    <span class="truncate">{{ item.name }}</span>
  </button>

  <!-- Folder -->
  <div v-else>
    <button
      type="button"
      class="hover:bg-muted-foreground/10 text-muted-foreground flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm whitespace-nowrap"
      :style="{ paddingLeft: indent }"
      @click="open = !open"
    >
      <ChevronRight
        :class="
          cn(
            'size-3.5 shrink-0 transition-transform',
            open && 'rotate-90',
          )
        "
      />
      <Folder class="size-3.5 shrink-0" />
      <span class="truncate">{{ item.name }}</span>
    </button>
    <div v-if="open">
      <BlockFileTreeNode
        v-for="(child, idx) in item.children"
        :key="idx"
        :item="child"
        :depth="depth + 1"
        :active="active"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>
