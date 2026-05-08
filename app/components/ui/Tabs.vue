<script setup lang="ts">
/**
 * Lightweight tabs primitive — emits `update:modelValue` and exposes the
 * currently-active tab so children can show/hide via v-show or v-if.
 *
 * Usage:
 * <Tabs v-model="active" :items="[{ value: 'a', label: 'A' }, ...]">
 *   <template #a>Content A</template>
 *   <template #b>Content B</template>
 * </Tabs>
 */
import { cn } from "@/lib/utils";

defineProps<{
  modelValue: string;
  items: { value: string; label: string }[];
  class?: string;
  listClass?: string;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <div :class="cn('w-full', $props.class)">
    <div
      role="tablist"
      :class="
        cn(
          'bg-muted text-muted-foreground inline-flex h-8 items-center rounded-md p-1',
          listClass,
        )
      "
    >
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        role="tab"
        :aria-selected="modelValue === item.value"
        :class="
          cn(
            'inline-flex h-6 items-center justify-center rounded-sm px-2.5 text-xs font-medium transition-all',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            modelValue === item.value
              ? 'bg-background text-foreground shadow-sm'
              : 'hover:text-foreground',
          )
        "
        @click="$emit('update:modelValue', item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="mt-3">
      <slot :name="modelValue" />
    </div>
  </div>
</template>
