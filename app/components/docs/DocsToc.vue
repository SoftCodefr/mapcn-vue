<script setup lang="ts">
import { cn } from "@/lib/utils";

interface TocItem { title: string; slug: string }

const props = defineProps<{ items: TocItem[]; class?: string }>();

const activeId = ref<string | null>(null);
let observer: IntersectionObserver | null = null;

const setupObserver = () => {
  if (typeof window === "undefined" || !props.items?.length) return;

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      }
    },
    { rootMargin: "0% 0% -80% 0%" },
  );
  for (const item of props.items) {
    const el = document.getElementById(item.slug);
    if (el) observer.observe(el);
  }
};

onMounted(setupObserver);
onBeforeUnmount(() => observer?.disconnect());

watch(() => props.items, () => nextTick(setupObserver), { deep: true });

const navCls = computed(() => cn("flex flex-col", props.class));
</script>

<template>
  <nav v-if="items.length" aria-label="On this page" :class="navCls">
    <p class="text-sidebar-foreground/70 mb-3 text-xs font-medium">
      On This Page
    </p>
    <div class="flex flex-col gap-0.5">
      <a
        v-for="item in items"
        :key="item.slug"
        :href="`#${item.slug}`"
        :class="
          cn(
            'py-1 text-sm no-underline transition-colors',
            item.slug === activeId
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground',
          )
        "
      >
        {{ item.title }}
      </a>
    </div>
  </nav>
</template>
