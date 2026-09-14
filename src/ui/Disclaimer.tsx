import type { ReactNode } from "react";

/** The standing note at the foot of atlas pages. */
export function Disclaimer({ children, crisis = false }: { children?: ReactNode; crisis?: boolean }) {
  return (
    <p className="mt-8 border-t border-rule pt-3 text-[0.82rem] leading-snug text-inksoft">
      {children ?? (
        <>
          This is a map of conversations, not a clinic. Nothing here diagnoses, treats, or replaces care. Folk correspondences sit beside
          lived-experience tags so they can be compared, not collapsed.
        </>
      )}
      {crisis && <> If you are in crisis in the US, call or text 988.</>}
    </p>
  );
}
