import { useEffect, useRef, useState } from "react";
import { BookingApp } from "../booking/BookingApp";
import "./bookBench.css";

/** A handset: 390x844 of glass inside an 11px shell. */
const SCREEN_W = 390;
const SCREEN_H = 844;
const SHELL = 11;

/**
 * The same contract the IFE bench has, at a different size: the surface is
 * fixed and scaling it is somebody else's job. Nothing inside the phone may
 * learn how big the window is, because a booking flow that reflows on a
 * desktop is a different piece of design from the one being made here.
 */
function useFitScale(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(
        Math.min(1, width / (SCREEN_W + SHELL * 2), height / (SCREEN_H + SHELL * 2)),
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

export function BookBench() {
  const stage = useRef<HTMLDivElement | null>(null);
  const scale = useFitScale(stage);

  return (
    <div className="bookbench">
      <div className="bookbench-stage" ref={stage}>
        <a className="bench-back" href="/dev/">
          ← Developer directory
        </a>
        <div
          className="bookbench-fit"
          style={{
            width: (SCREEN_W + SHELL * 2) * scale,
            height: (SCREEN_H + SHELL * 2) * scale,
          }}
        >
          <div className="bookbench-shell" style={{ transform: `scale(${scale})` }}>
            <div className="bookbench-glass">
              <BookingApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
