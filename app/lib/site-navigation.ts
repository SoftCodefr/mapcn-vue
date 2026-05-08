import { BookOpen, Layers2, type LucideIcon } from "lucide-vue-next";

export interface SiteNavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  isNew?: boolean;
}

export interface SiteNavigationGroup {
  title: string;
  items: SiteNavigationItem[];
}

export const docsNavigation: SiteNavigationGroup[] = [
  {
    title: "Basics",
    items: [
      { title: "Getting Started", href: "/docs", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: BookOpen },
      { title: "API Reference", href: "/docs/api-reference", icon: BookOpen },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Map", href: "/docs/basic-map", icon: Layers2 },
      { title: "Controls", href: "/docs/controls", icon: Layers2 },
      { title: "Markers", href: "/docs/markers", icon: Layers2 },
      { title: "Popups", href: "/docs/popups", icon: Layers2 },
      { title: "Routes", href: "/docs/routes", icon: Layers2 },
      { title: "Arcs", href: "/docs/arcs", icon: Layers2 },
      { title: "Clusters", href: "/docs/clusters", icon: Layers2 },
      { title: "Advanced", href: "/docs/advanced-usage", icon: Layers2 },
    ],
  },
];

/** Flat list useful for command-search / prev-next computation. */
export const flatDocsNavigation: SiteNavigationItem[] = docsNavigation.flatMap(
  (g) => g.items,
);

export function findAdjacentDocs(currentHref: string): {
  prev?: SiteNavigationItem;
  next?: SiteNavigationItem;
} {
  const idx = flatDocsNavigation.findIndex((it) => it.href === currentHref);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? flatDocsNavigation[idx - 1] : undefined,
    next:
      idx < flatDocsNavigation.length - 1
        ? flatDocsNavigation[idx + 1]
        : undefined,
  };
}
