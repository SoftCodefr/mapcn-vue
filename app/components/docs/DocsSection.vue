<script setup lang="ts">
const props = defineProps<{ title?: string }>();

const slug = computed(() =>
  props.title
    ? props.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : undefined,
);
</script>

<template>
  <section class="scroll-m-24 space-y-5" :id="slug">
    <h2
      v-if="title"
      class="text-foreground text-xl font-semibold tracking-tight"
    >
      {{ title }}
    </h2>
    <div
      class="text-primary [&_strong]:text-foreground [&_em]:text-muted-foreground space-y-4 text-base leading-7 [&_strong]:font-medium [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-5 [&>ol>li]:leading-7 [&>p]:leading-7 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul>li]:leading-7"
    >
      <slot />
    </div>
  </section>
</template>
