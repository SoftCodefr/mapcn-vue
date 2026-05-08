<script setup lang="ts">
import { getAllBlocks } from "@/lib/blocks";

useHead({
  title: "Map blocks · mapcn-vue",
  meta: [
    {
      name: "description",
      content:
        "Pre-built, ready-to-use map blocks. Browse, preview, and copy them into your app with one command.",
    },
  ],
});

const blocks = getAllBlocks();
</script>

<template>
  <div class="mx-auto w-full max-w-screen-2xl px-6">
    <section
      class="animate-fade-up animate-stagger flex flex-col gap-4 py-16 md:py-20"
      :style="{ '--stagger': 1 }"
    >
      <h1 class="text-3xl font-semibold tracking-tight md:text-5xl">
        Map blocks for your application
      </h1>
      <p class="text-muted-foreground max-w-2xl md:text-lg">
        Pre-built, ready-to-use map blocks. Browse, preview, and copy them into
        your app with one command.
      </p>
      <div class="flex gap-3">
        <a
          href="#blocks"
          class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition-colors"
        >
          Browse Blocks
        </a>
        <NuxtLink
          to="/docs"
          class="hover:bg-accent inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors"
        >
          View Documentation
        </NuxtLink>
      </div>
    </section>

    <section
      id="blocks"
      class="animate-fade-up animate-stagger scroll-mt-20 space-y-20 pb-20"
      :style="{ '--stagger': 4 }"
    >
      <BlockDisplay v-for="block in blocks" :key="block.name" :name="block.name" />
    </section>
  </div>
</template>
