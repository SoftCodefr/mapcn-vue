<script setup lang="ts">
useHead({
  title: "mapcn-vue · ready-to-use Vue map components",
});
</script>

<template>
  <div class="mx-auto w-full max-w-screen-2xl">
    <!-- Page header -->
    <div class="relative">
      <div
        class="pointer-events-none absolute inset-x-0 -inset-y-10 overflow-hidden"
      >
        <div
          class="absolute inset-0 opacity-[0.16] dark:opacity-[0.12]"
          style="
            background-image: radial-gradient(
              circle,
              currentcolor 1px,
              transparent 1px
            );
            background-size: 24px 24px;
          "
        ></div>
        <div
          class="from-background to-background absolute inset-0 bg-linear-to-b via-transparent"
        ></div>
      </div>
      <section
        class="container mx-auto flex w-full max-w-6xl flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24"
      >
        <h1
          class="animate-fade-up animate-stagger max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          style="--stagger: 1"
        >
          <span
            class="from-foreground via-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent"
            >Beautiful maps, made simple</span
          >
        </h1>
        <p
          class="text-muted-foreground animate-fade-up animate-stagger max-w-2xl text-center leading-relaxed sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed"
          style="--stagger: 2"
        >
          Ready to use, customizable map components for React.<br
            class="hidden sm:block"
          />Built on MapLibre. Styled with Tailwind.
        </p>
        <div
          class="animate-fade-up animate-stagger mt-3 flex flex-wrap items-center justify-center gap-3"
          style="--stagger: 3"
        >
          <a
            data-slot="button"
            data-variant="default"
            data-size="lg"
            class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-primary text-primary-foreground hover:bg-primary/90 has-[&gt;svg]:px-4 inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
            href="/docs"
            >Get Started</a
          ><a
            data-slot="button"
            data-variant="outline"
            data-size="lg"
            class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-background hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 has-[&gt;svg]:px-4 inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-6 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
            href="/docs/basic-map"
            >View Components</a
          >
        </div>
      </section>
    </div>

    <!-- Examples grid -->
    <section
      class="animate-fade-in animate-stagger px-6 pb-16"
      :style="{ '--stagger': 4 }"
    >
      <ExamplesGrid />
    </section>
  </div>
</template>
