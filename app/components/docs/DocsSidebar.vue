<script setup lang="ts">
import { docsNavigation } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

const route = useRoute();
</script>

<template>
  <aside
    class="bg-background sticky top-14 z-30 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overscroll-none lg:block"
  >
    <div class="overflow-y-auto pt-6 pr-4 pl-2 [scrollbar-gutter:stable]">
      <div v-for="group in docsNavigation" :key="group.title" class="pb-4">
        <p
          class="text-sidebar-foreground/70 mb-1 px-2 text-xs font-medium"
        >
          {{ group.title }}
        </p>
        <ul class="flex flex-col">
          <li v-for="item in group.items" :key="item.href">
            <NuxtLink
              :to="item.href"
              :class="
                cn(
                  'flex h-8 items-center rounded-md px-2 text-sm transition-colors',
                  route.path === item.href
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )
              "
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>
