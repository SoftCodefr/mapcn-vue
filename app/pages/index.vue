<script setup lang="ts">
useHead({
  title: "mapcn-vue · ready-to-use Vue map components",
});
</script>

<template>
  <div class="mx-auto w-full max-w-screen-2xl">
    <!-- Page header -->
    <section
      class="animate-fade-up animate-stagger flex flex-col items-center gap-6 px-6 py-16 text-center md:py-24"
      :style="{ '--stagger': 1 }"
    >
      <h1 class="text-3xl font-semibold tracking-tight md:text-5xl">
        Beautiful maps, made simple
      </h1>
      <p class="text-muted-foreground max-w-2xl md:text-lg">
        Ready to use, customizable map components for Vue.<br
          class="hidden sm:block"
        >
        Built on MapLibre. Styled with Tailwind.
      </p>
      <div class="flex gap-3">
        <NuxtLink
          to="/docs"
          class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition-colors"
        >
          Get started
        </NuxtLink>
        <NuxtLink
          to="/docs/basic-map"
          class="hover:bg-accent inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors"
        >
          View components
        </NuxtLink>
      </div>
    </section>

    <!-- Examples grid -->
    <section
      class="animate-fade-in animate-stagger px-6 pb-16"
      :style="{ '--stagger': 4 }"
    >
      <ExamplesGrid />
    </section>
  </div>
</template>
