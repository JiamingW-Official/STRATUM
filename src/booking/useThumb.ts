import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * One object that moves.
 *
 * Every control on this glass that is a choice between peers — the tab bar,
 * the cabin row, return or one way, the five days — is drawn the same way: a
 * groove with a single raised thumb in it, and the thumb slides to whichever
 * key is chosen. Four keys turning their own backgrounds on and off is four
 * things happening; one thumb moving is the thing a physical control does.
 *
 * The thumb is measured from the chosen key rather than computed, so it
 * survives a label being wider than its neighbours, and it is measured a
 * frame late, because the row's widths can depend on which key is chosen and
 * reading them in the same tick gives the arrangement that is on its way out.
 */
export function useThumb<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[],
): { x: number; y: number; w: number; h: number } | null {
  const [thumb, setThumb] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const first = useRef(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = ref.current?.querySelector<HTMLElement>('[data-on="true"]');
      if (el)
        setThumb({
          x: el.offsetLeft,
          y: el.offsetTop,
          w: el.offsetWidth,
          h: el.offsetHeight,
        });
      first.current = false;
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return thumb;
}
