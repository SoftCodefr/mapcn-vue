<script setup lang="ts">
import routeSource from "@/components/docs/examples/RouteExample.vue?raw";
import osrmRouteSource from "@/components/docs/examples/OsrmRouteExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Routes · mapcn-vue" });

const toc = [
  { title: "Basic Route", slug: "basic-route" },
  { title: "Route Planning", slug: "route-planning" },
];
</script>

<template>
  <DocsPage
    title="Routes"
    description="Draw lines and paths connecting coordinates on the map."
    :prev="{ title: 'Popups', href: '/docs/popups' }"
    :next="{ title: 'Arcs', href: '/docs/arcs' }"
    :toc="toc"
  >
    <DocsSection>
      <p>
        Use <DocsCode>MapRoute</DocsCode> to draw lines connecting a series of
        coordinates. Perfect for showing directions, trails, or any path between
        points.
      </p>
    </DocsSection>

    <DocsSection title="Basic Route">
      <p>Draw a route with numbered stop markers along the path.</p>
      <ComponentPreview :code="routeSource">
        <RouteExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Route Planning">
      <p>
        Display multiple route options and let users select between them. This
        example fetches real driving directions from the
        <DocsLink href="https://project-osrm.org/" external>OSRM API</DocsLink>.
        Click on a route or use the buttons to switch.
      </p>
      <ComponentPreview :code="osrmRouteSource" class="h-[500px]">
        <OsrmRouteExample />
      </ComponentPreview>
    </DocsSection>
  </DocsPage>
</template>
