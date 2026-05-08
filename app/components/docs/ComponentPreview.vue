<script setup lang="ts">
import { highlightCode } from "@/lib/highlight";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    class?: string;
  }>(),
  { language: "vue" },
);

const expanded = ref(false);

const { data: highlighted } = await useAsyncData(
  `preview:${props.language}:${props.code.length}:${props.code.slice(0, 32)}`,
  () => highlightCode(props.code, props.language),
);

const previewCls = computed(() =>
  cn("h-[420px] w-full overflow-hidden rounded-lg border", props.class),
);

const codeCls = computed(() =>
  cn(
    "bg-muted/40 overflow-hidden p-4 text-sm transition-[max-height] [&_code]:bg-transparent! [&_pre]:bg-transparent!",
    expanded.value ? "max-h-[420px] overflow-auto" : "max-h-44",
  ),
);
</script>

<template>
  <div class="space-y-4">
    <div :class="previewCls">
      <slot />
    </div>

    <div class="relative w-full overflow-hidden rounded-lg border">
      <div class="absolute top-2 right-2 z-10">
        <CopyButton :text="code" />
      </div>
      <div :class="codeCls" v-html="highlighted ?? ''" />
      <div
        class="absolute inset-x-0 bottom-0 flex w-full items-center justify-center"
        :class="
          !expanded
            ? 'from-background to-background/0 bg-linear-to-t pt-12 pb-6'
            : ''
        "
      >
        <button
          v-if="!expanded"
          type="button"
          class="bg-background hover:bg-muted border-border inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors"
          @click="expanded = true"
        >
          View Code
        </button>
      </div>
    </div>
  </div>
</template>
