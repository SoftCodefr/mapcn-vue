<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div class="space-y-3">
    <h1 class="text-foreground text-3xl font-semibold tracking-tight">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-muted-foreground text-base leading-relaxed"
    >
      {{ description }}
    </p>
  </div>
</template>
