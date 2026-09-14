import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  pressed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Swatch dot colour (the design's layer chip). */
  swatch?: string;
  /** Small copper suffix, e.g. "default" / "2nd" / "on select". */
  tag?: string;
  peek?: boolean;
  title?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** The design's toggle chip. `aria-pressed` reflects `pressed`. */
export function Chip({ children, pressed, onClick, onMouseEnter, onMouseLeave, swatch, tag, peek, title, disabled, className = "", style }: ChipProps) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={pressed === undefined ? undefined : pressed}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      className={`chip${peek ? " peek" : ""} disabled:opacity-60 ${className}`}
    >
      {swatch && <span className="sw" style={{ background: swatch }} />}
      <span>{children}</span>
      {tag && <span className="tag">{tag}</span>}
    </button>
  );
}

/** Non-interactive label pill. */
export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block rounded-[11px] border border-rule px-[9px] py-[1px] text-[12.5px] text-inksoft ${className}`}>{children}</span>;
}
