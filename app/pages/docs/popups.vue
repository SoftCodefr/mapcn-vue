<script setup lang="ts">
import popupSource from "@/components/docs/examples/StandalonePopupExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Popups · mapcn-vue" });
</script>

<template>
  <DocsPage
    title="Standalone Popups"
    description="Display popups anywhere on the map without markers."
    :prev="{ title: 'Markers', href: '/docs/markers' }"
    :next="{ title: 'Routes', href: '/docs/routes' }"
  >
    <DocsSection>
      <p>
        Use <DocsCode>MapPopup</DocsCode> to display a popup at any location on
        the map. Unlike <DocsCode>MarkerPopup</DocsCode>, standalone popups are
        not attached to markers and can be controlled programmatically.
      </p>
      <ComponentPreview :code="popupSource">
        <StandalonePopupExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
