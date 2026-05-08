<script setup lang="ts">
interface TocItem {
  title: string;
  slug: string;
}

defineProps<{
  title: string;
  description?: string;
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
  toc?: TocItem[];
}>();
</script>

<template>
  <div class="flex size-full">
    <div
      class="mx-auto flex max-w-[52rem] min-w-0 flex-1 flex-col pt-10 pb-20 lg:px-4"
    >
      <DocsTitle :title="title" :description="description" />
      <div class="mt-12 mb-12 space-y-12">
        <slot />
      </div>
      <DocsPagination :prev="prev" :next="next" />
    </div>

    <aside class="hidden w-44 shrink-0 xl:block">
      <nav
        class="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto pt-10 pb-10 [scrollbar-gutter:stable]"
      >
        <DocsToc v-if="toc?.length" :items="toc" />
      </nav>
    </aside>
  </div>
</template>
