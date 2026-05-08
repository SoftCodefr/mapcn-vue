<script setup lang="ts">
defineProps<{
  rows: { name: string; type: string; default?: string; description: string }[];
}>();
</script>

<template>
  <div class="my-6 overflow-hidden rounded-lg border">
    <table class="w-full">
      <thead>
        <tr class="bg-muted/30 border-b">
          <th class="h-10 px-4 text-left text-xs font-medium">Prop</th>
          <th class="h-10 px-4 text-left text-xs font-medium">Type</th>
          <th class="h-10 px-4 text-left text-xs font-medium">Default</th>
          <th class="h-10 px-4 text-left text-xs font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.name"
          class="border-b last:border-b-0"
        >
          <td class="px-4 py-3 align-top">
            <DocsCode class="text-[13px]">{{ row.name }}</DocsCode>
          </td>
          <td class="px-4 py-3 align-top whitespace-normal">
            <DocsCode class="text-muted-foreground text-xs">
              {{ row.type }}
            </DocsCode>
          </td>
          <td class="px-4 py-3 align-top">
            <DocsCode class="text-muted-foreground text-xs whitespace-normal">
              {{ row.default ?? "—" }}
            </DocsCode>
          </td>
          <td
            class="text-foreground/70 min-w-[180px] px-4 py-3 text-sm leading-relaxed whitespace-normal"
          >
            {{ row.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
