<script setup lang="ts">
import advancedSource from "@/components/docs/examples/AdvancedUsageExample.vue?raw";
import customLayerSource from "@/components/docs/examples/CustomLayerExample.vue?raw";
import layerMarkersSource from "@/components/docs/examples/LayerMarkersExample.vue?raw";

definePageMeta({ layout: "docs" });
useHead({ title: "Advanced · mapcn-vue" });

const refCode = `<script setup lang="ts">
import { ref } from "vue";
import { Map, type MapRef } from "@/components/ui/map";

const mapRef = ref<{ map: { value: MapRef | null } } | null>(null);

const handleFlyTo = () => {
  // Access the underlying MapLibre instance via the exposed \`map\` ref.
  mapRef.value?.map?.value?.flyTo({ center: [-74, 40.7], zoom: 12 });
};
<\/script>

<template>
  <button @click="handleFlyTo">Fly to NYC</button>
  <Map ref="mapRef" :center="[-74, 40.7]" :zoom="10" />
</template>`;

const useMapCode = `<script setup lang="ts">
import { Map, useMap } from "@/components/ui/map";
import { onBeforeUnmount, watch } from "vue";

// For child components inside <Map>, use the useMap composable.
function MapEventListener() {
  const { map, isLoaded } = useMap();
  let cleanup: (() => void) | null = null;

  watch([map, isLoaded], ([m, loaded]) => {
    cleanup?.();
    cleanup = null;
    if (!m || !loaded) return;
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      console.log("Clicked at:", e.lngLat);
    };
    m.on("click", handleClick);
    cleanup = () => m.off("click", handleClick);
  });

  onBeforeUnmount(() => cleanup?.());
}
<\/script>

<template>
  <Map :center="[-74, 40.7]" :zoom="10">
    <MapEventListener />
  </Map>
</template>`;

const toc = [
  { title: "Using a Ref", slug: "using-a-ref" },
  { title: "Using the Composable", slug: "using-the-composable" },
  { title: "Example: Custom Controls", slug: "example-custom-controls" },
  { title: "Example: Custom GeoJSON Layer", slug: "example-custom-geojson-layer" },
  { title: "Example: Markers via Layers", slug: "example-markers-via-layers" },
  { title: "Extend to Build", slug: "extend-to-build" },
];
</script>

<template>
  <DocsPage
    title="Advanced"
    description="Access the underlying MapLibre GL instance for advanced customization."
    :prev="{ title: 'Clusters', href: '/docs/clusters' }"
    :toc="toc"
  >
    <DocsSection>
      <p>
        Access the underlying MapLibre GL map instance to use any feature from
        the MapLibre GL JS API. You can use either a template <DocsCode>ref</DocsCode>
        or the <DocsCode>useMap</DocsCode> composable.
      </p>
    </DocsSection>

    <DocsNote>
      <strong>Tip:</strong> Check the
      <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/" external>
        MapLibre GL JS documentation
      </DocsLink>
      for the full list of available methods and events.
    </DocsNote>

    <DocsSection title="Using a Ref">
      <p>
        The simplest way to access the map instance from a parent component.
        The <DocsCode>Map</DocsCode> component exposes its MapLibre instance
        via <DocsCode>defineExpose</DocsCode>.
      </p>
      <CodeBlock :code="refCode" language="vue" />
    </DocsSection>

    <DocsSection title="Using the Composable">
      <p>
        For child components rendered inside <DocsCode>Map</DocsCode>, use the
        <DocsCode>useMap</DocsCode> composable to access the map instance and
        listen to events.
      </p>
      <CodeBlock :code="useMapCode" language="vue" />
    </DocsSection>

    <DocsSection title="Example: Custom Controls">
      <p>
        This example shows how to create custom controls that manipulate the
        map's pitch and bearing, and listen to map events to display real-time
        values.
      </p>
      <ComponentPreview :code="advancedSource">
        <AdvancedUsageExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Example: Custom GeoJSON Layer">
      <p>
        Add custom GeoJSON data as layers with fill and outline styles. This
        example shows NYC parks with hover interactions.
      </p>
      <ComponentPreview :code="customLayerSource">
        <CustomLayerExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Example: Markers via Layers">
      <p>
        When displaying hundreds or thousands of markers, use GeoJSON layers
        instead of DOM-based <DocsCode>MapMarker</DocsCode> components. This
        approach renders markers on the WebGL canvas, providing significantly
        better performance.
      </p>
      <ComponentPreview :code="layerMarkersSource">
        <LayerMarkersExample />
      </ComponentPreview>
    </DocsSection>

    <DocsSection title="Extend to Build">
      <p>You can extend this to build custom features like:</p>
      <ul>
        <li><strong>Real-time tracking</strong> — Live location updates for delivery, rides, or fleet management</li>
        <li><strong>Geofencing</strong> — Trigger actions when users enter or leave specific areas</li>
        <li><strong>Heatmaps</strong> — Visualize density data like population, crime, or activity hotspots</li>
        <li><strong>Drawing tools</strong> — Let users draw polygons, lines, or place markers for custom areas</li>
        <li><strong>3D buildings</strong> — Extrude building footprints for urban visualization</li>
        <li><strong>Animations</strong> — Animate markers along routes or create fly-through experiences</li>
        <li><strong>Custom data layers</strong> — Overlay weather, traffic, or satellite imagery</li>
      </ul>
    </DocsSection>
  </DocsPage>
</template>
