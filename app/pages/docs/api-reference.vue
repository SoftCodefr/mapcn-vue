<script setup lang="ts">
definePageMeta({ layout: "docs" });
useHead({ title: "API Reference · mapcn-vue" });

const anatomyCode = `<Map>
  <MapMarker :longitude="..." :latitude="...">
    <MarkerContent>
      <MarkerLabel />
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>

  <MapPopup :longitude="..." :latitude="..." />
  <MapControls />
  <MapRoute :coordinates="..." />
  <MapArc :data="..." />
  <MapClusterLayer :data="..." />
</Map>`;

const useMapCode = `const { map, isLoaded } = useMap();`;

const toc = [
  { title: "Component Anatomy", slug: "component-anatomy" },
  { title: "Map", slug: "map" },
  { title: "useMap", slug: "usemap" },
  { title: "MapControls", slug: "mapcontrols" },
  { title: "MapMarker", slug: "mapmarker" },
  { title: "MarkerContent", slug: "markercontent" },
  { title: "MarkerPopup", slug: "markerpopup" },
  { title: "MarkerTooltip", slug: "markertooltip" },
  { title: "MarkerLabel", slug: "markerlabel" },
  { title: "MapPopup", slug: "mappopup" },
  { title: "MapRoute", slug: "maproute" },
  { title: "MapArc", slug: "maparc" },
  { title: "MapClusterLayer", slug: "mapclusterlayer" },
];

const mapProps = [
  {
    name: "default slot",
    type: "VNode[]",
    description: "Child components (markers, popups, controls, routes).",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the map container.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    description:
      "Theme for the map. If not provided, automatically detects from .dark/.light class on <html> or system preference.",
  },
  {
    name: "styles",
    type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
    description:
      "Custom map styles for light and dark themes. Overrides default Carto basemap tiles.",
  },
  {
    name: "projection",
    type: "ProjectionSpecification",
    description:
      'Map projection type. Use { type: "globe" } for 3D globe view.',
  },
  {
    name: "viewport",
    type: "Partial<MapViewport>",
    description:
      "Controlled viewport state. Use with v-model:viewport (or :viewport + @update:viewport) to drive the map state.",
  },
  {
    name: "@update:viewport",
    type: "(viewport: MapViewport) => void",
    description:
      "Emitted continuously as the viewport changes (during pan, zoom, rotate). Use as event listener or pair with :viewport via v-model.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show a loading indicator on the map.",
  },
  {
    name: "...$attrs",
    type: "MapOptions",
    description:
      "Native MapLibre options (center, zoom, scrollZoom, dragPan, ...) flow through $attrs to the underlying Map constructor.",
  },
];

const controlsProps = [
  {
    name: "position",
    type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
    default: '"bottom-right"',
    description: "Position of the controls on the map.",
  },
  {
    name: "showZoom",
    type: "boolean",
    default: "true",
    description: "Show zoom in/out buttons.",
  },
  {
    name: "showCompass",
    type: "boolean",
    default: "false",
    description: "Show compass button to reset bearing.",
  },
  {
    name: "showLocate",
    type: "boolean",
    default: "false",
    description: "Show locate button to find user's location.",
  },
  {
    name: "showFullscreen",
    type: "boolean",
    default: "false",
    description: "Show fullscreen toggle button.",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the controls container.",
  },
  {
    name: "@locate",
    type: "(coords: { longitude: number; latitude: number }) => void",
    description: "Emitted with the user's coordinates when located.",
  },
];

const markerProps = [
  {
    name: "longitude",
    type: "number",
    description: "Longitude coordinate for marker position.",
  },
  {
    name: "latitude",
    type: "number",
    description: "Latitude coordinate for marker position.",
  },
  {
    name: "default slot",
    type: "VNode[]",
    description:
      "Marker subcomponents (MarkerContent, MarkerPopup, MarkerTooltip, MarkerLabel).",
  },
  {
    name: "@click",
    type: "(e: MouseEvent) => void",
    description: "Emitted when marker is clicked.",
  },
  {
    name: "@mouseenter",
    type: "(e: MouseEvent) => void",
    description: "Emitted when mouse enters the marker.",
  },
  {
    name: "@mouseleave",
    type: "(e: MouseEvent) => void",
    description: "Emitted when mouse leaves the marker.",
  },
  {
    name: "@dragstart",
    type: "(lngLat: { lng, lat }) => void",
    description: "Emitted when marker drag starts (requires draggable: true).",
  },
  {
    name: "@drag",
    type: "(lngLat: { lng, lat }) => void",
    description: "Emitted during marker drag (requires draggable: true).",
  },
  {
    name: "@dragend",
    type: "(lngLat: { lng, lat }) => void",
    description: "Emitted when marker drag ends (requires draggable: true).",
  },
];

const markerContentProps = [
  {
    name: "default slot",
    type: "VNode[]",
    description:
      "Custom marker content. Defaults to a blue dot if no slot content is provided.",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the marker container.",
  },
];

const markerPopupProps = [
  { name: "default slot", type: "VNode[]", description: "Popup content." },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the popup container.",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button in the popup.",
  },
];

const markerTooltipProps = [
  { name: "default slot", type: "VNode[]", description: "Tooltip content." },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the tooltip container.",
  },
];

const markerLabelProps = [
  { name: "default slot", type: "VNode[]", description: "Label text content." },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the label.",
  },
  {
    name: "position",
    type: '"top" | "bottom"',
    default: '"top"',
    description: "Position of the label relative to the marker.",
  },
];

const mapPopupProps = [
  {
    name: "longitude",
    type: "number",
    description: "Longitude coordinate for popup position.",
  },
  {
    name: "latitude",
    type: "number",
    description: "Latitude coordinate for popup position.",
  },
  {
    name: "@close",
    type: "() => void",
    description: "Emitted when the popup is closed.",
  },
  { name: "default slot", type: "VNode[]", description: "Popup content." },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the popup container.",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button in the popup.",
  },
];

const mapRouteProps = [
  {
    name: "id",
    type: "string",
    default: "auto",
    description:
      "Optional unique identifier for the route layer. Auto-generated if not provided.",
  },
  {
    name: "coordinates",
    type: "[number, number][]",
    description: "Array of [longitude, latitude] coordinate pairs.",
  },
  {
    name: "color",
    type: "string",
    default: '"#4285F4"',
    description: "Line color (CSS color value).",
  },
  {
    name: "width",
    type: "number",
    default: "3",
    description: "Line width in pixels.",
  },
  {
    name: "opacity",
    type: "number",
    default: "0.8",
    description: "Line opacity (0 to 1).",
  },
  {
    name: "dashArray",
    type: "[number, number]",
    description: "Dash pattern [dash length, gap length] for dashed lines.",
  },
  {
    name: "@click",
    type: "() => void",
    description: "Emitted when the route line is clicked.",
  },
  {
    name: "@mouseenter",
    type: "() => void",
    description: "Emitted when mouse enters the route line.",
  },
  {
    name: "@mouseleave",
    type: "() => void",
    description: "Emitted when mouse leaves the route line.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description:
      "Whether the route is interactive (shows pointer cursor on hover).",
  },
];

const mapArcProps = [
  {
    name: "data",
    type: "MapArcDatum[]",
    description:
      "Arcs to render. Each needs a unique id and from / to as [lng, lat]. Extra fields forwarded to feature properties.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description: "Id prefix for the underlying source/layers.",
  },
  {
    name: "curvature",
    type: "number",
    default: "0.2",
    description:
      "How far the arc bows away from a straight line. 0 = straight, higher = more bend, negative = opposite side.",
  },
  {
    name: "samples",
    type: "number",
    default: "64",
    description: "Points per arc. Higher = smoother.",
  },
  {
    name: "paint",
    type: "LineLayerSpecification['paint']",
    default:
      '{ "line-color": "#4285F4", "line-width": 2, "line-opacity": 0.85 }',
    description:
      "Paint props merged over defaults. Values may be MapLibre expressions for per-feature styling.",
  },
  {
    name: "layout",
    type: "LineLayerSpecification['layout']",
    default: '{ "line-join": "round", "line-cap": "round" }',
    description: "Layout props merged over defaults.",
  },
  {
    name: "hoverPaint",
    type: "LineLayerSpecification['paint']",
    description:
      "Paint overrides applied to the hovered arc via feature-state.",
  },
  {
    name: "@click",
    type: "(e: MapArcEvent) => void",
    description: "Emitted when an arc is clicked.",
  },
  {
    name: "@hover",
    type: "(e: MapArcEvent | null) => void",
    description:
      "Emitted when the hovered arc changes. Receives null when the cursor leaves all arcs.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description: "Respond to mouse events (hover, cursor, callbacks).",
  },
  {
    name: "beforeId",
    type: "string",
    description: "Insert the arc layers before this layer id.",
  },
];

const mapClusterProps = [
  {
    name: "data",
    type: "string | GeoJSON.FeatureCollection",
    description: "GeoJSON FeatureCollection or URL to fetch GeoJSON from.",
  },
  {
    name: "clusterMaxZoom",
    type: "number",
    default: "14",
    description: "Maximum zoom level to cluster points on.",
  },
  {
    name: "clusterRadius",
    type: "number",
    default: "50",
    description: "Radius of each cluster in pixels.",
  },
  {
    name: "clusterColors",
    type: "[string, string, string]",
    default: '["#22c55e", "#eab308", "#ef4444"]',
    description:
      "Colors for cluster circles: [small, medium, large] based on point count.",
  },
  {
    name: "clusterThresholds",
    type: "[number, number]",
    default: "[100, 750]",
    description:
      "Point count thresholds for color/size steps: [medium, large].",
  },
  {
    name: "pointColor",
    type: "string",
    default: '"#3b82f6"',
    description: "Color for unclustered individual points.",
  },
  {
    name: "manualClusterClick",
    type: "boolean",
    default: "false",
    description:
      "When true, suppresses the default zoom behavior on cluster click — only the @clusterClick event is emitted.",
  },
  {
    name: "@pointClick",
    type: "(feature: GeoJSON.Feature, coordinates: [number, number]) => void",
    description: "Emitted when an unclustered point is clicked.",
  },
  {
    name: "@clusterClick",
    type: "(clusterId: number, coordinates: [number, number], pointCount: number) => void",
    description:
      "Emitted when a cluster is clicked. If no listener is bound (or manualClusterClick is false), the cluster auto-zooms.",
  },
];
</script>

<template>
  <DocsPage
    title="API Reference"
    description="Complete reference for all map components and their props."
    :prev="{ title: 'Installation', href: '/docs/installation' }"
    :next="{ title: 'Map', href: '/docs/basic-map' }"
    :toc="toc"
  >
    <DocsNote>
      <strong>Note:</strong> This library is built on top of
      <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
        MapLibre GL JS </DocsLink
      >. Most components extend the native MapLibre options. Refer to the
      <DocsLink
        href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
        external
      >
        MapLibre Map API
      </DocsLink>
      for additional options not listed here.
    </DocsNote>

    <DocsSection title="Component Anatomy">
      <p>All parts of the component you can combine to build your map.</p>
      <CodeBlock :code="anatomyCode" language="vue" :show-copy-button="false" />
    </DocsSection>

    <DocsSection title="Map">
      <p>
        The root container component that initializes MapLibre GL and provides
        context to child components. Automatically handles theme switching
        between light and dark modes.
      </p>
      <p>
        Native MapLibre
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/"
          external
        >
          MapOptions
        </DocsLink>
        (excluding <DocsCode>container</DocsCode> and
        <DocsCode>style</DocsCode>) flow through <DocsCode>$attrs</DocsCode> —
        pass them as regular Vue attributes (e.g.
        <DocsCode>:scroll-zoom="false"</DocsCode>).
      </p>
      <DocsPropTable :rows="mapProps" />
    </DocsSection>

    <DocsSection title="useMap">
      <p>
        A composable that provides access to the MapLibre map instance and
        loading state. Must be used within a <DocsCode>Map</DocsCode> component.
      </p>
      <CodeBlock :code="useMapCode" language="ts" :show-copy-button="false" />
      <p>
        Returns <DocsCode>map</DocsCode> (a
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
          external
        >
          MapLibre.Map
        </DocsLink>
        <DocsCode>Ref</DocsCode>) and <DocsCode>isLoaded</DocsCode> (boolean
        <DocsCode>Ref</DocsCode>) which is true once the map is ready.
      </p>
    </DocsSection>

    <DocsSection title="MapControls">
      <p>
        Renders map control buttons (zoom, compass, locate, fullscreen). Must be
        used inside <DocsCode>Map</DocsCode>.
      </p>
      <DocsPropTable :rows="controlsProps" />
    </DocsSection>

    <DocsSection title="MapMarker">
      <p>
        A container for marker-related components. Provides context for its
        children and handles marker positioning.
      </p>
      <p>
        Native MapLibre
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/"
          external
        >
          MarkerOptions
        </DocsLink>
        (excluding <DocsCode>element</DocsCode>) flow through
        <DocsCode>$attrs</DocsCode>.
      </p>
      <DocsPropTable :rows="markerProps" />
    </DocsSection>

    <DocsSection title="MarkerContent">
      <p>
        Renders the visual content of a marker. Must be used inside
        <DocsCode>MapMarker</DocsCode>. If no slot content is provided, renders
        a default blue dot marker.
      </p>
      <DocsPropTable :rows="markerContentProps" />
    </DocsSection>

    <DocsSection title="MarkerPopup">
      <p>
        Renders a popup attached to the marker that opens on click. Must be used
        inside <DocsCode>MapMarker</DocsCode>.
      </p>
      <p>
        Extends
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
          external
        >
          PopupOptions
        </DocsLink>
        from MapLibre GL (excluding <DocsCode>className</DocsCode> and
        <DocsCode>closeButton</DocsCode>).
      </p>
      <DocsNote>
        The <DocsCode>className</DocsCode> and <DocsCode>closeButton</DocsCode>
        from MapLibre's PopupOptions are excluded to prevent style conflicts.
        Use the component's own props to style the popup. MapLibre's default
        popup styles are reset via CSS.
      </DocsNote>
      <DocsPropTable :rows="markerPopupProps" />
    </DocsSection>

    <DocsSection title="MarkerTooltip">
      <p>
        Renders a tooltip that appears on hover. Must be used inside
        <DocsCode>MapMarker</DocsCode>.
      </p>
      <p>
        Extends
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
          external
        >
          PopupOptions
        </DocsLink>
        from MapLibre GL (excluding <DocsCode>className</DocsCode>,
        <DocsCode>closeButton</DocsCode>, and <DocsCode>closeOnClick</DocsCode>
        — tooltips auto-dismiss on hover out).
      </p>
      <DocsPropTable :rows="markerTooltipProps" />
    </DocsSection>

    <DocsSection title="MarkerLabel">
      <p>
        Renders a text label above or below the marker. Must be used inside
        <DocsCode>MarkerContent</DocsCode>.
      </p>
      <DocsPropTable :rows="markerLabelProps" />
    </DocsSection>

    <DocsSection title="MapPopup">
      <p>
        A standalone popup component placed at any coordinate without a marker.
        Must be used inside <DocsCode>Map</DocsCode>.
      </p>
      <DocsPropTable :rows="mapPopupProps" />
    </DocsSection>

    <DocsSection title="MapRoute">
      <p>
        Renders a line/route on the map connecting coordinate points. Must be
        used inside <DocsCode>Map</DocsCode>. Supports click and hover for
        building route-selection UIs.
      </p>
      <DocsPropTable :rows="mapRouteProps" />
    </DocsSection>

    <DocsSection title="MapArc">
      <p>
        Renders curved lines between coordinate pairs using a quadratic Bézier
        in longitude/latitude space. Must be used inside
        <DocsCode>Map</DocsCode>.
      </p>
      <p>
        Built on a MapLibre
        <DocsLink
          href="https://maplibre.org/maplibre-style-spec/layers/#line"
          external
        >
          line layer
        </DocsLink>
        — the <DocsCode>paint</DocsCode> and <DocsCode>layout</DocsCode> props
        accept any field from <DocsCode>LineLayerSpecification</DocsCode>.
      </p>
      <p>
        Style per arc with a
        <DocsLink
          href="https://maplibre.org/maplibre-style-spec/expressions/"
          external
        >
          MapLibre expression
        </DocsLink>
        as any paint value. Reference fields on each datum with
        <DocsCode>["get", "fieldName"]</DocsCode>.
      </p>
      <DocsPropTable :rows="mapArcProps" />
    </DocsSection>

    <DocsSection title="MapClusterLayer">
      <p>
        Renders clustered point data using MapLibre's native clustering. Groups
        nearby points into clusters that expand on click. Must be used inside
        <DocsCode>Map</DocsCode>. Supports a generic type parameter for typed
        feature properties:
        <DocsCode>&lt;MapClusterLayer&lt;MyProperties&gt; /&gt;</DocsCode>.
      </p>
      <DocsPropTable :rows="mapClusterProps" />
    </DocsSection>
  </DocsPage>
</template>
