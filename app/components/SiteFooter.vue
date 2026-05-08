<template>
  <footer class="border-t border-border bg-background">
    <div
      class="mx-auto flex max-w-screen-2xl flex-col items-center gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between"
    >
      <p>
        Built with
        <NuxtLink to="/" class="text-foreground hover:underline">mapcn-vue</NuxtLink>.
        Vue port of
        <a
          href="https://mapcn.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="text-foreground hover:underline"
        >mapcn</a>.
      </p>
      <p>MIT licensed.</p>
    </div>
  </footer>
</template>
