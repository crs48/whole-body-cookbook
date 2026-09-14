import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { referenceHref } from "../reference/index";
import { KIND_SINGULAR } from "../reference/schema";
import { MIN_QUERY, useSearch } from "../reference/search";

interface Props {
  variant: "header" | "page";
  autoFocus?: boolean;
}

/** Full-text search over the reference. Header variant listens for `/`. */
export function SearchBox({ variant, autoFocus }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useSearch(q, variant === "header" ? 8 : 20);
  const listId = useId();

  useEffect(() => {
    if (variant !== "header") return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  useEffect(() => setActive(0), [q]);

  const go = (slug: string) => {
    window.location.hash = referenceHref(slug);
    setOpen(false);
    if (variant === "header") {
      setQ("");
      inputRef.current?.blur();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      const r = results[active];
      if (r) {
        e.preventDefault();
        go(r.slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showList = open && q.trim().length >= MIN_QUERY;
  const header = variant === "header";

  return (
    <div className={header ? "relative w-[min(15rem,50vw)]" : "relative mb-5 max-w-[42rem]"}>
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        placeholder={header ? "Search the reference  /" : "Search rooms, conditions, meridians, modalities…"}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        className={`field placeholder:text-inkmute ${header ? "py-[3px] text-[13px]" : "py-2 text-[15px]"}`}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className={`${header ? "absolute right-0 z-20 mt-1 w-[min(22rem,90vw)] border border-[rgb(28_22_18/.3)] bg-paper shadow-[0_12px_30px_rgba(28,22,18,0.15)]" : "mt-2 border border-rulesoft bg-[rgb(28_22_18/.025)]"}`}
        >
          {results.length === 0 && <li className="px-3 py-2 text-[13px] italic text-inksoft">Nothing yet for “{q.trim()}”.</li>}
          {results.map((r, i) => (
            <li key={r.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <a
                href={referenceHref(r.slug)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(r.slug);
                }}
                onMouseEnter={() => setActive(i)}
                className={`block px-3 py-2 ${i === active ? "bg-[rgb(28_22_18/.08)]" : ""}`}
              >
                <span className="sc text-verdigris">{KIND_SINGULAR[r.kind]}</span>
                <span className="block text-[15px] font-medium leading-tight text-ink">{r.title}</span>
                <span className="block text-[12.5px] leading-[1.35] text-inksoft">{r.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
