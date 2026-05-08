<script setup lang="ts">
defineProps<{ href: string; external?: boolean }>();
</script>

<template>
  <NuxtLink
    :to="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="text-foreground font-medium underline underline-offset-4"
  >
    <slot />
  </NuxtLink>
</template>
