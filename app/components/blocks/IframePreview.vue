<script setup lang="ts">
defineProps<{ src: string; title: string }>();
</script>

<template>
  <div
    class="relative h-(--block-preview-height) w-full overflow-hidden rounded-xl border"
  >
    <iframe :src="src" :title="title" class="dark size-full border-0" />
  </div>
</template>
