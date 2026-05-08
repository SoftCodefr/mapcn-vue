<script setup lang="ts">
import clusterSource from "@/components/docs/examples/ClusterExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Clusters · mapcn-vue" });
</script>

<template>
  <DocsPage
    title="Clusters"
    description="Visualize large datasets with automatic point clustering."
    :prev="{ title: 'Arcs', href: '/docs/arcs' }"
    :next="{ title: 'Advanced', href: '/docs/advanced-usage' }"
  >
    <DocsSection>
      <p>
        The <DocsCode>MapClusterLayer</DocsCode> component uses MapLibre's
        built-in clustering to efficiently render large numbers of points.
        Points are automatically grouped into clusters at low zoom levels and
        expand as you zoom in.
      </p>
    </DocsSection>

    <DocsSection title="Basic Example">
      <p>
        Click on clusters to zoom in. Click individual points to see details in
        a popup.
      </p>
      <ComponentPreview :code="clusterSource">
        <ClusterExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
