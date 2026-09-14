import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkWikiLinks from "./remark-wikilinks";
import referenceRaw from "./vite-reference-raw";

// Custom domain (wbc.earth) is served from the root, not a /project-page/ path.
export default defineConfig({
  base: "/",
  plugins: [
    referenceRaw({ contentDir: "content" }),
    {
      // MDX must run before plugin-react so .mdx files reach React as JSX.
      enforce: "pre",
      ...mdx({
        include: /\.mdx$/,
        jsxImportSource: "react",
        remarkPlugins: [remarkFrontmatter, remarkGfm, [remarkWikiLinks, { contentDir: "content" }]],
      }),
    },
    // Default include (.tsx/.jsx only): plugin-react must not touch `.mdx?raw` imports,
    // which it otherwise rewrites into JSX modules in dev. MDX edits still hot-reload.
    react(),
    tailwindcss(),
  ],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
