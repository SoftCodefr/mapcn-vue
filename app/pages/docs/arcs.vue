<script setup lang="ts">
import arcSource from "@/components/docs/examples/ArcExample.vue?raw";
import interactiveArcSource from "@/components/docs/examples/InteractiveArcExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Arcs · mapcn-vue" });

const toc = [
  { title: "Basic Arc", slug: "basic-arc" },
  { title: "Interactive Arcs", slug: "interactive-arcs" },
];
</script>

<template>
  <DocsPage
    title="Arcs"
    description="Draw curved connections between two coordinates with hover and click support."
    :prev="{ title: 'Routes', href: '/docs/routes' }"
    :next="{ title: 'Clusters', href: '/docs/clusters' }"
    :toc="toc"
  >
    <DocsSection>
      <p>
        Use <DocsCode>MapArc</DocsCode> to draw curved lines between coordinate
        pairs. Arcs are great for showing flight paths, shipping lanes, or any
        origin–destination connection where a straight line would feel flat.
      </p>
    </DocsSection>

    <DocsSection title="Basic Arc">
      <p>
        Pass an array of arcs to the <DocsCode>data</DocsCode> prop. Each arc
        needs a unique <DocsCode>id</DocsCode> and <DocsCode>from</DocsCode> /
        <DocsCode>to</DocsCode> coordinates as
        <DocsCode>[longitude, latitude]</DocsCode> tuples.
      </p>
      <ComponentPreview :code="arcSource">
        <ArcExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Interactive Arcs">
      <p>
        Combine <DocsCode>hoverPaint</DocsCode> with the
        <DocsCode>@hover</DocsCode> event to highlight an arc and surface
        details in a <DocsCode>MapPopup</DocsCode>. Use a
        <DocsCode>match</DocsCode> expression on
        <DocsCode>line-color</DocsCode> to style arcs by category. Here, air
        and sea lanes are styled differently.
      </p>
      <ComponentPreview :code="interactiveArcSource">
        <InteractiveArcExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
