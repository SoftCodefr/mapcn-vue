import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_FILE = path.join(ROOT, "registry.json");
const OUT_DIR = path.join(ROOT, "public", "r");

interface RegistryFile {
  path: string;
  type?: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  css?: unknown;
  meta?: unknown;
  categories?: string[];
}

interface RegistryData {
  $schema?: string;
  name: string;
  homepage?: string;
  items: RegistryItem[];
}

const FROM_IMPORT = "@/components/ui/map";
const TO_IMPORT_INDEX = "@/components/ui/map";

function fixImports(content: string): string {
  // The library uses relative imports between its own files (./context, ./composables/use-map, etc.)
  // and an alias-based import for the global utils (@/lib/utils). Both should remain valid in
  // the consumer project.
  return content;
}

function build() {
  const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
  const data = JSON.parse(raw) as RegistryData;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const indexEntries: Pick<
    RegistryItem,
    "name" | "type" | "title" | "description"
  >[] = [];

  for (const item of data.items) {
    const built: RegistryItem = {
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      files: (item.files ?? []).map((f) => {
        const abs = path.join(ROOT, f.path);
        const content = fs.existsSync(abs)
          ? fixImports(fs.readFileSync(abs, "utf-8"))
          : "";
        return { ...f, content };
      }),
      css: item.css,
      meta: item.meta,
      categories: item.categories,
    };

    const outPath = path.join(OUT_DIR, `${item.name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(built, null, 2) + "\n", "utf-8");
    console.log("Built:", path.relative(ROOT, outPath));

    indexEntries.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
    });
  }

  const indexOut = {
    $schema: data.$schema,
    name: data.name,
    homepage: data.homepage,
    items: indexEntries,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify(indexOut, null, 2) + "\n",
    "utf-8",
  );
  console.log("Built: public/r/registry.json");
}

build();
// Silence unused-warning if alias rewriting is enabled later.
void TO_IMPORT_INDEX;
void FROM_IMPORT;
