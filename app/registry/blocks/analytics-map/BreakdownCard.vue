<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/ui/Card.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import CardContent from "@/components/ui/CardContent.vue";
import type { BreakdownRow } from "./data";

const props = defineProps<{ title: string; rows: BreakdownRow[] }>();

const maxRowValue = computed(() =>
  props.rows.length > 0 ? Math.max(...props.rows.map((r) => r.value)) : 0,
);
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
    </CardHeader>

    <CardContent>
      <div
        class="text-muted-foreground mb-2 flex items-center justify-between text-[11px] tracking-wider uppercase"
      >
        <span>{{ title }}</span>
        <span>Visitors</span>
      </div>
      <div class="space-y-3">
        <div v-for="row in rows" :key="row.label" class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground/90 truncate">{{ row.label }}</span>
            <span class="text-foreground font-medium">{{ row.value }}</span>
          </div>
          <div class="bg-muted h-1 rounded-full">
            <div
              class="h-full rounded-full bg-blue-500/85"
              :style="{ width: `${(row.value / maxRowValue) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
