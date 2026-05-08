/**
 * Read the raw source of every block file at build time.
 *
 * Vite's `import.meta.glob` with `?raw` and `eager: true` resolves all matches
 * statically — sources are bundled into the SSR output, so the docs site can
 * render highlighted code blocks without hitting the file system at runtime.
 *
 * In Nuxt 4 with `app/` as source dir, we use a relative path from this file.
 */
const blockSources = import.meta.glob<string>(
  "../registry/blocks/**/*.{vue,ts}",
  { query: "?raw", import: "default", eager: true },
);

/**
 * Look up a block file's source. The `path` field in `registry.json` is repo-
 * relative (`app/registry/blocks/heatmap/Heatmap.vue`); the glob keys are
 * relative to this file (`../registry/blocks/heatmap/Heatmap.vue`).
 */
export function getBlockFileSource(path: string): string {
  // Convert registry path to relative glob key
  // "app/registry/blocks/foo/Bar.vue" → "../registry/blocks/foo/Bar.vue"
  const relativeKey = path.replace(/^app\/registry\/blocks\//, "../registry/blocks/");
  
  const direct = blockSources[relativeKey];
  if (direct) return direct;

  // Fallback: match by filename suffix
  const match = Object.entries(blockSources).find(([key]) =>
    key.endsWith(path.split("/").pop() ?? ""),
  );
  return match?.[1] ?? "";
}
