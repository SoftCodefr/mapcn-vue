<script setup lang="ts">
type Props = { class?: string };
defineProps<Props>();
</script>

<template>
  <NuxtLink
    to="/"
    :class="['flex items-center gap-1.5 font-semibold', $props.class]"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      class="size-5"
      aria-hidden="true"
    >
      <path
        d="M3 6.5L9 4L15 6.5L21 4V17.5L15 20L9 17.5L3 20V6.5Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M9 4V17.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M15 6.5V20"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>
    <span>mapcn-vue</span>
  </NuxtLink>
</template>
