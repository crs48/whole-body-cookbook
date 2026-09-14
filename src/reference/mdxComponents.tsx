import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { entryBySlug } from "./index";

/** `<a>` for MDX: internal wikilinks show the entry title; external links open in a new tab. */
export function RefLink(props: ComponentProps<"a"> & { "data-wikilink"?: string }) {
  const { href = "", children, className, ...rest } = props;
  const slug = props["data-wikilink"];
  if (slug !== undefined) {
    const entry = entryBySlug(slug);
    const label = children ?? entry?.title ?? slug;
    if (!entry) {
      return (
        <a {...rest} href={href} className={`${className ?? ""} text-hot`} title="No entry yet">
          {label}
        </a>
      );
    }
    return (
      <a {...rest} href={href} className={className} title={entry.summary}>
        {typeof children === "string" && children === slug ? entry.title : label}
      </a>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a {...rest} href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}

/** Author-protocol callout for supplements, binders, distillation. */
export function Protocol({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-3 max-w-[42rem] border-l-2 border-copper pl-3">
      <p className="kicker-sm mb-1 text-copper">Author protocol · v0.1 board</p>
      <div className="text-[0.92rem] text-inksoft">{children}</div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h1: (p) => <h2 className="h2" {...p} />,
  h2: (p) => <h2 className="h2" {...p} />,
  h3: (p) => <h3 className="mt-4 mb-1 font-display text-[1.05rem]" {...p} />,
  a: RefLink,
  pre: (p) => <pre className="code" {...p} />,
  code: (p) => <code className="mono" {...p} />,
  table: (p) => (
    <div className="overflow-x-auto">
      <table className="table" {...p} />
    </div>
  ),
  blockquote: (p) => <blockquote className="my-3 max-w-[42rem] border-l-2 border-rule pl-3 italic text-inksoft" {...p} />,
  hr: () => <hr className="my-6 border-rule" />,
  Protocol,
};
