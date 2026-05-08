<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";

const props = defineProps<{ text: string }>();

const copied = ref(false);

const onClick = async () => {
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <button
    type="button"
    aria-label="Copy code"
    class="text-muted-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
    @click="onClick"
  >
    <Check v-if="copied" class="size-3.5" />
    <Copy v-else class="size-3.5" />
  </button>
</template>
