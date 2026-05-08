<script setup lang="ts">
definePageMeta({ layout: "docs" });
useHead({ title: "Installation · mapcn-vue" });

const installCommand = "npx shadcn-vue@latest add https://mapcn-vue.com/r/map.json";

const usageCode = `<script setup lang="ts">
import { Map, MapControls } from "@/components/ui/map";
<\/script>

<template>
  <div class="h-[320px] overflow-hidden rounded-lg border">
    <Map :center="[-74.006, 40.7128]" :zoom="11">
      <MapControls />
    </Map>
  </div>
</template>`;

const toc = [
  { title: "Prerequisites", slug: "prerequisites" },
  { title: "Installation", slug: "installation" },
  { title: "Usage", slug: "usage" },
];
</script>

<template>
  <DocsPage
    title="Installation"
    description="How to install and set up mapcn-vue in your project."
    :prev="{ title: 'Introduction', href: '/docs' }"
    :next="{ title: 'API Reference', href: '/docs/api-reference' }"
    :toc="toc"
  >
    <DocsSection title="Prerequisites">
      <p>
        A Vue 3 project with
        <DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>
        and
        <DocsLink href="https://www.shadcn-vue.com" external>shadcn-vue</DocsLink>
        set up.
      </p>
    </DocsSection>

    <DocsSection title="Installation">
      <p>Run the following command to add the map component:</p>
      <CodeBlock :code="installCommand" language="bash" />
      <p>
        This will install <DocsCode>maplibre-gl</DocsCode> and copy the map
        components into <DocsCode>components/ui/map/</DocsCode>.
      </p>
    </DocsSection>

    <DocsSection title="Usage">
      <p>Import and use the map component:</p>
      <CodeBlock :code="usageCode" language="vue" />
      <div class="h-[320px] overflow-hidden rounded-lg border">
        <ClientOnly>
          <Map :center="[-74.006, 40.7128]" :zoom="11">
            <MapControls />
          </Map>
        </ClientOnly>
      </div>
    </DocsSection>

    <DocsNote>
      <strong>Note:</strong> The map uses free CARTO basemap tiles by default.
      Tiles automatically switch between light and dark themes.
    </DocsNote>
  </DocsPage>
</template>
