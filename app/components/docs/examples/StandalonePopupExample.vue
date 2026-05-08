<script setup lang="ts">
const showPopup = ref(true);
</script>

<template>
  <div class="relative h-[420px] w-full">
    <ClientOnly>
      <Map :center="[-74.006, 40.7128]" :zoom="13">
        <MapPopup
          v-if="showPopup"
          :longitude="-74.006"
          :latitude="40.7128"
          close-button
          :focus-after-open="false"
          :close-on-click="false"
          @close="showPopup = false"
        >
          <div class="space-y-2">
            <h3 class="text-foreground font-semibold">New York City</h3>
            <p class="text-muted-foreground text-sm">
              The city that never sleeps. Population: 8.3 million
            </p>
            <button
              type="button"
              class="hover:bg-accent border-border bg-background inline-flex h-8 w-full items-center justify-center rounded-md border text-xs font-medium transition-colors"
              @click="showPopup = false"
            >
              Close
            </button>
          </div>
        </MapPopup>
      </Map>
    </ClientOnly>

    <button
      v-if="!showPopup"
      type="button"
      class="bg-primary text-primary-foreground hover:bg-primary/90 absolute bottom-4 left-4 z-10 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors"
      @click="showPopup = true"
    >
      Show Popup
    </button>
  </div>
</template>
