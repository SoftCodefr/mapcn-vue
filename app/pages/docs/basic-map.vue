<script setup lang="ts">
import basicMapSource from "@/components/docs/examples/BasicMapExample.vue?raw";
import controlledMapSource from "@/components/docs/examples/ControlledMapExample.vue?raw";
import customStyleSource from "@/components/docs/examples/CustomStyleExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Map · mapcn-vue" });

const toc = [
  { title: "Basic Usage", slug: "basic-usage" },
  { title: "Controlled Mode", slug: "controlled-mode" },
  { title: "Custom Styles", slug: "custom-styles" },
];
</script>

<template>
  <DocsPage
    title="Map"
    description="The simplest way to add an interactive map to your application."
    :prev="{ title: 'API Reference', href: '/docs/api-reference' }"
    :next="{ title: 'Controls', href: '/docs/controls' }"
    :toc="toc"
  >
    <DocsSection title="Basic Usage">
      <p>
        The <DocsCode>Map</DocsCode> component handles MapLibre GL setup,
        theming, and provides context for child components.
      </p>
      <ComponentPreview :code="basicMapSource">
        <BasicMapExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Controlled Mode">
      <p>
        Use <DocsCode>v-model:viewport</DocsCode> (or the
        <DocsCode>:viewport</DocsCode> prop with
        <DocsCode>@update:viewport</DocsCode>) to control the viewport
        externally. Useful when you need to sync the map state with your
        application or react to viewport changes.
      </p>
      <ComponentPreview :code="controlledMapSource">
        <ControlledMapExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Custom Styles">
      <p>
        Use the <DocsCode>styles</DocsCode> prop to provide custom map styles.
        This example uses free vector tiles from
        <DocsLink href="https://openfreemap.org" external>OpenFreeMap</DocsLink
        >, an open-source project sourcing data from OpenStreetMap.
      </p>
      <ComponentPreview :code="customStyleSource">
        <CustomStyleExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
