/**
 * `virtual:reference-raw` — the raw source of every `content/**​/*.mdx` file,
 * keyed like Vite's glob keys (`/content/region/heart.mdx`).
 *
 * Why a virtual module: `import.meta.glob(..., { query: "?raw" })` on .mdx is
 * compiled as MDX by @mdx-js/rollup in dev (it strips the query before
 * filtering). Reading the files here sidesteps that and keeps the index
 * independent of how the pages are compiled.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { Plugin } from "vite";

const VIRTUAL = "virtual:reference-raw";
const RESOLVED = `\0${VIRTUAL}`;

interface Options {
  contentDir: string;
}

function listMdx(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

export default function referenceRaw({ contentDir }: Options): Plugin {
  return {
    name: "wbc-reference-raw",
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      const cwd = process.cwd();
      const out: Record<string, string> = {};
      for (const file of listMdx(join(cwd, contentDir))) {
        this.addWatchFile(file);
        const key = `/${relative(cwd, file).split(sep).join("/")}`;
        out[key] = readFileSync(file, "utf8");
      }
      return `export default ${JSON.stringify(out)};`;
    },
    handleHotUpdate({ file, server, modules }) {
      if (!file.endsWith(".mdx") || !file.includes(`${sep}${contentDir}${sep}`)) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (!mod) return;
      server.moduleGraph.invalidateModule(mod);
      return [...modules, mod];
    },
  };
}
