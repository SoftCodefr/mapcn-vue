<script setup lang="ts">
const footerLinks = {
  product: [
    { label: "Documentation", href: "/docs" },
    { label: "Components", href: "/docs/basic-map" },
    { label: "Blocks", href: "/blocks" },
  ],
  community: [
    {
      label: "GitHub",
      href: "https://github.com/SoftCodefr/mapcn-vue",
      external: true,
    },
  ],
  resources: [
    { label: "MapLibre GL", href: "https://maplibre.org/", external: true },
    { label: "shadcn-vue", href: "https://shadcn-vue.com/", external: true },
    {
      label: "Tailwind CSS",
      href: "https://tailwindcss.com/",
      external: true,
    },
  ],
};
</script>

<template>
  <footer class="mt-30 border-t">
    <div class="container mx-auto py-12 md:py-16">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div class="col-span-2 md:col-span-1">
          <Logo class="w-fit" />
          <p
            class="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed"
          >
            Free & open-source, ready-to-use, customizable map components for
            Vue.js.
          </p>
          <p class="text-muted-foreground mt-3 text-sm">
            Ported by
            <a
              href="https://softcode.fr"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              SoftCode.fr
            </a>
          </p>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold">Product</h3>
          <ul class="space-y-2.5">
            <li v-for="link in footerLinks.product" :key="link.href">
              <NuxtLink
                :to="link.href"
                class="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold">Community</h3>
          <ul class="space-y-2.5">
            <li v-for="link in footerLinks.community" :key="link.href">
              <NuxtLink
                :to="link.href"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="mb-3 text-sm font-semibold">Resources</h3>
          <ul class="space-y-2.5">
            <li v-for="link in footerLinks.resources" :key="link.href">
              <NuxtLink
                :to="link.href"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noopener noreferrer' : undefined"
                class="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
