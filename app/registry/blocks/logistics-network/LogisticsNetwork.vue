<script setup lang="ts">
import { hubs, routes } from "./data";
import FilterSidebar from "./FilterSidebar.vue";
import NetworkMap from "./NetworkMap.vue";
</script>

<template>
  <div class="flex h-screen w-full">
    <FilterSidebar :hubs="hubs" :routes="routes" />
    <main class="flex-1 overflow-hidden">
      <NetworkMap :hubs="hubs" :routes="routes" />
    </main>
  </div>
</template>
