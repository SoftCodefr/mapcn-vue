<script setup lang="ts">
import controlsSource from "@/components/docs/examples/MapControlsExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Controls · mapcn-vue" });
</script>

<template>
  <DocsPage
    title="Controls"
    description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
    :prev="{ title: 'Map', href: '/docs/basic-map' }"
    :next="{ title: 'Markers', href: '/docs/markers' }"
  >
    <DocsSection>
      <p>
        The <DocsCode>MapControls</DocsCode> component provides a set of
        interactive controls that can be positioned on any corner of the map.
      </p>
      <ComponentPreview :code="controlsSource">
        <MapControlsExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
