<script setup lang="ts">
import { Box, Code, Layers, Moon, Puzzle, Zap } from "lucide-vue-next";

definePageMeta({ layout: "docs" });
useHead({ title: "Introduction · mapcn-vue" });

const features = [
  { icon: Zap, title: "Zero Config", description: "Works out of the box with free map tiles. No API keys needed." },
  { icon: Moon, title: "Theme Aware", description: "Automatically switches between light and dark map styles." },
  { icon: Puzzle, title: "Composable", description: "Build complex UIs with simple, composable components." },
  { icon: Code, title: "TypeScript", description: "Full type safety with comprehensive TypeScript support." },
  { icon: Box, title: "Copy & Paste", description: "Own your code. No dependencies, just copy into your project." },
  { icon: Layers, title: "Any Map Style", description: "Use any MapLibre-compatible tiles: MapTiler, Carto, OpenStreetMap, and more." },
];

const toc = [
  { title: "Philosophy", slug: "philosophy" },
  { title: "Why mapcn?", slug: "why-mapcn" },
  { title: "Any Map Style", slug: "any-map-style" },
  { title: "Features", slug: "features" },
];
</script>

<template>
  <DocsPage
    title="Introduction"
    description="Copy-paste map components for Vue."
    :next="{ title: 'Installation', href: '/docs/installation' }"
    :toc="toc"
  >
    <DocsSection>
      <p>
        <strong>mapcn-vue</strong> provides beautifully designed, accessible, and
        customizable map components for Vue. Built on
        <DocsLink href="https://maplibre.org" external>MapLibre GL</DocsLink>,
        styled with
        <DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>,
        and designed to play nice with
        <DocsLink href="https://www.shadcn-vue.com" external>shadcn-vue</DocsLink>.
      </p>
    </DocsSection>

    <DocsSection title="Philosophy">
      <p>
        mapcn-vue follows the shadcn model for maps: copy-paste components you
        own, with zero lock-in and sensible defaults that work immediately.
      </p>
      <p>
        Maps are often hidden behind heavy wrapper libraries and config-laden
        SDKs. mapcn-vue takes a different approach: it stays close to MapLibre,
        keeps the API familiar, and lets you drop down to the raw map instance
        whenever you need more control.
      </p>
      <p>
        The goal is simple: make maps feel like the rest of your UI stack —
        composable, themeable, accessible, and easy to customize with Tailwind
        and shadcn patterns.
      </p>
    </DocsSection>

    <DocsSection title="Why mapcn?">
      <p>
        Most Vue map setups are either too opinionated or too heavy. mapcn-vue
        is built for teams that want to ship quickly without giving up control:
      </p>
      <ul>
        <li><strong>Own Your Code:</strong> copy the components into your project and customize anything.</li>
        <li><strong>Start Fast:</strong> one command and a basic map renders with production-ready defaults.</li>
        <li><strong>Scale Safely:</strong> stay on top of MapLibre directly, drop to raw APIs when needed.</li>
        <li><strong>Design-System Friendly:</strong> styled with Tailwind, fits naturally with shadcn-vue.</li>
      </ul>
    </DocsSection>

    <DocsSection title="Any Map Style">
      <p>
        mapcn-vue works with any
        <DocsLink href="https://maplibre.org/maplibre-style-spec/" external>MapLibre-compatible tiles</DocsLink>.
        You can use tiles from virtually any provider:
      </p>
      <ul>
        <li><DocsLink href="https://www.openstreetmap.org" external>OpenStreetMap</DocsLink> — community-driven, open-source map data</li>
        <li><DocsLink href="https://carto.com/basemaps" external>Carto</DocsLink> — clean, minimal basemaps for data viz</li>
        <li><DocsLink href="https://www.maptiler.com" external>MapTiler</DocsLink> — beautiful vector tiles, extensive customization</li>
        <li><DocsLink href="https://stadiamaps.com" external>Stadia Maps</DocsLink> — fast, reliable tile hosting</li>
        <li><DocsLink href="https://www.thunderforest.com" external>Thunderforest</DocsLink> — outdoors, cycling, transport themes</li>
        <li>Any other provider that supports the MapLibre style spec</li>
      </ul>
    </DocsSection>

    <DocsSection title="Features">
      <div class="not-prose mt-4 grid gap-4 sm:grid-cols-2">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-card space-y-3 rounded-lg border p-4"
        >
          <div class="flex items-center gap-2">
            <div
              class="bg-muted flex size-8 items-center justify-center rounded-md"
            >
              <component :is="feature.icon" class="text-foreground size-4" />
            </div>
            <h3 class="text-foreground text-base font-medium">
              {{ feature.title }}
            </h3>
          </div>
          <p class="text-muted-foreground text-sm">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </DocsSection>
  </DocsPage>
</template>
