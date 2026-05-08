<script setup lang="ts">
import { Github } from "lucide-vue-next";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/basic-map", label: "Components" },
  { href: "/playground", label: "Playground" },
];
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur"
  >
    <div class="mx-auto flex h-14 max-w-screen-2xl items-center gap-6 px-6">
      <Logo />
      <nav class="hidden items-center gap-4 text-sm md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="text-muted-foreground hover:text-foreground transition-colors"
          active-class="text-foreground"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="ml-auto flex items-center gap-2">
        <a
          href="https://github.com/AnmolSaini16/mapcn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors"
        >
          <Github class="size-4" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
