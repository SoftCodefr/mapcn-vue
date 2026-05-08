<script setup lang="ts">
import { computed } from "vue";
import { TrendingUp } from "lucide-vue-next";
import Card from "@/components/ui/Card.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardContent from "@/components/ui/CardContent.vue";
import { deviceCategoryData, usersPerDay } from "./data";

// Sparkline path: stroke + filled area gradient.
const sparkline = computed(() => {
  const W = 200;
  const H = 32;
  const PAD = 2;
  const values = usersPerDay.map((d) => d.users);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values.map((v, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (values.length - 1);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return [x, y] as const;
  });
  const lineD = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const fillD =
    `${lineD} L${points[points.length - 1]![0]},${H} L${points[0]![0]},${H} Z`;
  return { width: W, height: H, lineD, fillD };
});

// Donut chart: render each slice as an SVG arc.
const donut = computed(() => {
  const total = deviceCategoryData.reduce((sum, d) => sum + d.value, 0);
  const cx = 64;
  const cy = 64;
  const rOuter = 48;
  const rInner = 32;
  let cursor = -Math.PI / 2; // start at 12 o'clock
  return deviceCategoryData.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const a0 = cursor;
    const a1 = cursor + angle;
    cursor = a1;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x0 = cx + rOuter * Math.cos(a0);
    const y0 = cy + rOuter * Math.sin(a0);
    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const xi0 = cx + rInner * Math.cos(a1);
    const yi0 = cy + rInner * Math.sin(a1);
    const xi1 = cx + rInner * Math.cos(a0);
    const yi1 = cy + rInner * Math.sin(a0);
    const path =
      `M${x0},${y0} A${rOuter},${rOuter} 0 ${largeArc} 1 ${x1},${y1} ` +
      `L${xi0},${yi0} A${rInner},${rInner} 0 ${largeArc} 0 ${xi1},${yi1} Z`;
    return { ...d, path };
  });
});
</script>

<template>
  <Card class="bg-card/70 absolute top-4 left-4 z-10 w-60 backdrop-blur-sm">
    <CardHeader>
      <div>
        <p
          class="text-muted-foreground pb-2 text-[10px] tracking-wider uppercase"
        >
          Users in last 7 days
        </p>
        <p class="text-3xl leading-none font-semibold">3,803</p>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Sparkline -->
      <svg
        :viewBox="`0 0 ${sparkline.width} ${sparkline.height}`"
        preserveAspectRatio="none"
        class="aspect-auto h-8 w-full"
      >
        <defs>
          <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stop-color="rgb(59 130 246)"
              stop-opacity="0.4"
            />
            <stop
              offset="100%"
              stop-color="rgb(59 130 246)"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>
        <path :d="sparkline.fillD" fill="url(#usersGradient)" />
        <path
          :d="sparkline.lineD"
          fill="none"
          stroke="rgb(59 130 246)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>

      <div class="mt-4 flex items-center gap-1.5 text-xs">
        <TrendingUp class="size-3 text-emerald-500" />
        <span class="font-medium text-emerald-500">+12.5%</span>
        <span class="text-muted-foreground">vs previous 7 days</span>
      </div>

      <div class="border-border/60 mt-4 border-t pt-4">
        <p class="text-muted-foreground text-[10px] tracking-wider uppercase">
          Device category in last 7 days
        </p>

        <!-- Donut -->
        <svg
          viewBox="0 0 128 128"
          class="mx-auto mt-3 aspect-square h-32 w-32"
        >
          <path
            v-for="slice in donut"
            :key="slice.name"
            :d="slice.path"
            :fill="slice.color"
            stroke="var(--color-card)"
            stroke-width="2"
          />
        </svg>

        <div class="mt-3 grid grid-cols-3 gap-2">
          <div
            v-for="device in deviceCategoryData"
            :key="device.name"
            class="text-center"
          >
            <p
              class="text-muted-foreground flex items-center justify-center gap-1.5 text-[10px] tracking-wide uppercase"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: device.color }"
              />
              {{ device.name }}
            </p>
            <p
              class="text-foreground mt-1 leading-none font-medium tabular-nums"
            >
              {{ device.value }}%
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
