import type { ReactNode } from "react";

interface CardProps {
  kind?: string;
  title: string;
  children?: ReactNode;
  onClick?: () => void;
  footer?: ReactNode;
  className?: string;
}

/** A paper card. Becomes a button when `onClick` is given. */
export function Card({ kind, title, children, onClick, footer, className = "" }: CardProps) {
  const inner = (
    <>
      {kind && <div className="sc mb-[2px] text-verdigris">{kind}</div>}
      <h3 className="text-[16px] font-medium leading-[1.1] text-pretty">{title}</h3>
      {children && <div className="mt-1 text-[13.5px] leading-[1.35] text-inksoft text-pretty">{children}</div>}
      {footer && <div className="mt-2 flex flex-wrap gap-1">{footer}</div>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`card clickable w-full ${className}`}>
        {inner}
      </button>
    );
  }
  return <article className={`card ${className}`}>{inner}</article>;
}
