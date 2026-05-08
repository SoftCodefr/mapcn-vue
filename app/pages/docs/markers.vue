<script setup lang="ts">
import markersSource from "@/components/docs/examples/MarkersExample.vue?raw";
import popupSource from "@/components/docs/examples/PopupExample.vue?raw";
import draggableSource from "@/components/docs/examples/DraggableMarkerExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Markers · mapcn-vue" });

const toc = [
  { title: "Basic Example", slug: "basic-example" },
  { title: "Rich Popups", slug: "rich-popups" },
  { title: "Draggable Marker", slug: "draggable-marker" },
];
</script>

<template>
  <DocsPage
    title="Markers"
    description="Add interactive markers to your map with popups and tooltips."
    :prev="{ title: 'Controls', href: '/docs/controls' }"
    :next="{ title: 'Popups', href: '/docs/popups' }"
    :toc="toc"
  >
    <DocsSection>
      <p>
        Use <DocsCode>MapMarker</DocsCode> to place markers on the map. Each
        marker can have custom content, popups that open on click, and tooltips
        that appear on hover.
      </p>
    </DocsSection>

    <DocsNote>
      <strong>Performance tip:</strong> <DocsCode>MapMarker</DocsCode> is
      DOM-based and works best for a few hundred markers. For larger datasets,
      see the
      <DocsLink href="/docs/advanced-usage#example-markers-via-layers">
        GeoJSON layers example
      </DocsLink>
      instead. Rendering many DOM markers can make the browser sluggish.
    </DocsNote>

    <DocsSection title="Basic Example">
      <p>
        Simple markers with tooltips and popups showing location information.
      </p>
      <ComponentPreview :code="markersSource">
        <MarkersExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Rich Popups">
      <p>
        Build complex popups with images, ratings, and action buttons using
        shadcn-vue components (or any UI library you like).
      </p>
      <ComponentPreview :code="popupSource" class="h-[500px]">
        <PopupExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Draggable Marker">
      <p>
        Create draggable markers that users can move around the map. Click the
        marker to see its current coordinates in a popup.
      </p>
      <ComponentPreview :code="draggableSource">
        <DraggableMarkerExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
