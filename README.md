# mapcn-vue

Beautiful, ready-to-use map components for Vue. Built on [MapLibre GL](https://maplibre.org/), styled with [Tailwind CSS](https://tailwindcss.com/), designed to work seamlessly with [shadcn-vue](https://www.shadcn-vue.com/).

## Features

- **Zero config** — Works out of the box with sensible defaults and automatic theme detection
- **Composable** — Mix and match components: markers, popups, tooltips, routes, arcs, clusters
- **Customizable** — Full access to MapLibre options, style with Tailwind classes
- **Dark mode** — Automatic light/dark theme switching with Carto basemaps
- **TypeScript** — Fully typed components and composables
- **SSR friendly** — Works with Nuxt and other SSR frameworks

## Installation

```bash
npx shadcn-vue@latest add https://mapcn-vue.com/r/map.json
```

This will install the map components and their dependencies (`maplibre-gl`, `lucide-vue-next`).

## Quick Start

```vue
<script setup lang="ts">
import { Map, MapMarker, MarkerPopup } from '@/components/ui/map'
</script>

<template>
  <Map
    class="h-[400px] w-full rounded-lg"
    :center="[2.3522, 48.8566]"
    :zoom="12"
  >
    <MapMarker :lng-lat="[2.3522, 48.8566]">
      <MarkerPopup>
        <p class="font-medium">Paris, France</p>
      </MarkerPopup>
    </MapMarker>
  </Map>
</template>
```

## Components

### Core

| Component | Description |
|-----------|-------------|
| `Map` | The main map container. Wraps MapLibre GL and provides context to child components. |
| `MapMarker` | Place markers on the map with custom content. |
| `MapPopup` | Standalone popup anchored to coordinates. |
| `MapControls` | Navigation and zoom controls. |

### Marker Accessories

| Component | Description |
|-----------|-------------|
| `MarkerContent` | Custom marker content wrapper. |
| `MarkerLabel` | Text label for markers. |
| `MarkerPopup` | Popup that appears on marker click. |
| `MarkerTooltip` | Tooltip that appears on marker hover. |

### Layers

| Component | Description |
|-----------|-------------|
| `MapRoute` | Draw routes/polylines on the map. |
| `MapArc` | Animated arc lines between points (great for visualizing connections). |
| `MapClusterLayer` | Cluster markers at low zoom levels. |

## Props

### Map

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | auto | Force a theme or let it auto-detect from system/html class |
| `styles` | `{ light?: string, dark?: string }` | Carto | Custom map styles for each theme |
| `projection` | `ProjectionSpecification` | — | Map projection, use `{ type: 'globe' }` for 3D globe |
| `viewport` | `MapViewport` | — | Controlled viewport (use with `v-model:viewport`) |
| `loading` | `boolean` | `false` | Show loading overlay |

All [MapLibre MapOptions](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/) are passed through as props (center, zoom, minZoom, maxZoom, bearing, pitch, etc.).

### MapMarker

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lng-lat` | `[number, number]` | required | Marker coordinates `[longitude, latitude]` |
| `anchor` | `string` | `'center'` | Marker anchor position |

### MapRoute

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `coordinates` | `[number, number][]` | required | Array of route coordinates |
| `line-color` | `string` | `'#3b82f6'` | Route line color |
| `line-width` | `number` | `3` | Route line width |

### MapArc

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `MapArcDatum[]` | required | Array of arc data with source/target coordinates |
| `line-color` | `string` | `'#3b82f6'` | Arc line color |
| `animated` | `boolean` | `false` | Enable arc animation |

## Composables

### useMap

Access the MapLibre instance from child components:

```vue
<script setup lang="ts">
import { useMap } from '@/components/ui/map'

const { map, isLoaded } = useMap()

watchEffect(() => {
  if (isLoaded.value && map.value) {
    map.value.flyTo({ center: [0, 0], zoom: 2 })
  }
})
</script>
```

## Blocks

Pre-built, copy-paste examples for common use cases:

| Block | Description |
|-------|-------------|
| [Analytics Map](https://mapcn-vue.com/blocks/analytics-map) | Real-time analytics dashboard with world map and breakdown cards |
| [Logistics Network](https://mapcn-vue.com/blocks/logistics-network) | Domestic logistics visualization with filters and stats |
| [Heatmap](https://mapcn-vue.com/blocks/heatmap) | Globe-projected heatmap for data density visualization |
| [Delivery Tracker](https://mapcn-vue.com/blocks/delivery-tracker) | Live order tracking with route progress and courier position |

Install blocks via:

```bash
npx shadcn-vue@latest add https://mapcn-vue.com/r/analytics-map.json
```

## Custom Styles

Override default Carto basemaps with your own:

```vue
<Map
  :styles="{
    light: 'https://your-style-server.com/light.json',
    dark: 'https://your-style-server.com/dark.json'
  }"
/>
```

Or use a single style:

```vue
<Map
  :styles="{
    light: 'https://your-style.json',
    dark: 'https://your-style.json'
  }"
/>
```

## Globe Projection

Enable 3D globe view:

```vue
<Map :projection="{ type: 'globe' }" />
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Format code
npm run format
```

## License

MIT
