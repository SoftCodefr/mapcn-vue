<template>
  <div class="h-[420px] w-full">
    <ClientOnly>
      <Map :center="[2.3522, 48.8566]" :zoom="10">
        <MapControls
          position="top-right"
          show-zoom
          show-compass
          show-locate
          show-fullscreen
        />
      </Map>
    </ClientOnly>
  </div>
</template>
