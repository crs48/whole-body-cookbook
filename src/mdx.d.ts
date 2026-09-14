declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "mdx/types";
  const MDXContent: ComponentType<{ components?: MDXComponents }>;
  export default MDXContent;
}

/** Raw source of every content/**​/*.mdx, keyed `/content/<kind>/<slug>.mdx`. See vite-reference-raw.ts. */
declare module "virtual:reference-raw" {
  const raw: Record<string, string>;
  export default raw;
}
