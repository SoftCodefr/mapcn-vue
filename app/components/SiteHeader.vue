<script setup lang="ts">
import { Github } from "lucide-vue-next";

const navItems = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/basic-map", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/playground", label: "Playground" },
];
</script>

<template>
  <header
    class="bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 h-14 w-full backdrop-blur"
  >
    <div class="mx-auto flex h-14 max-w-screen-2xl items-center gap-6 px-6">
      <Logo />
      <Separator orientation="vertical" class="h-4!" />
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
          href="https://github.com/SoftCodefr/mapcn-vue"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="hover:bg-accent bg-background inline-flex size-8 items-center justify-center rounded-md transition-colors"
        >
          <Github class="size-4" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
