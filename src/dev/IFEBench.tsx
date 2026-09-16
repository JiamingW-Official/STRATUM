import { useEffect, useMemo, useRef, useState } from "react";
import { IFEApp } from "../ife/IFEApp";
import { createMockBridge } from "../ife/bridge";
import { useBench } from "./benchStore";
import { useMockFlight } from "./useMockFlight";
import { SimPanel } from "./SimPanel";
import "./bench.css";

/** The unit as built: 1920x1080 of glass inside a 28px moulded surround. */
const SCREEN_W = 1920;
const SCREEN_H = 1080;
const BEZEL = 28;

/**
 * Fits the whole seat-back unit into whatever space the stage has, without
 * ever telling the IFE about it. This is the contract that lets the same
 * component hang on a seat in a 3D cabin later: the screen is a fixed surface,
 * and scaling it is somebody else's job.
 */
function useFitScale(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const w = SCREEN_W + BEZEL * 2;
      const h = SCREEN_H + BEZEL * 2;
      // Never past 1:1. The glass is 1920x1080; blowing it up would be
      // judging the IFE at a size no seat-back screen has.
      setScale(Math.min(1, width / w, height / h));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

export function IFEBench() {
  const stage = useRef<HTMLDivElement | null>(null);
  const scale = useFitScale(stage);
  const seat = useBench((s) => s.seat);
  const bridge = useMemo(() => createMockBridge(seat), [seat]);

  useMockFlight();

  return (
    <div className="bench">
      <div className="bench-stage" ref={stage}>
        <a className="bench-back" href="/dev/">
          ← Developer directory
        </a>
        {/* Two boxes, because a 1976px element cannot be centred by the
            layout it overflows. The outer one is the size the unit actually
            occupies on screen; the inner one is the unit at full size, scaled
            from its top-left corner so layout and pixels agree. */}
        <div
          className="bench-fit"
          style={{
            width: (SCREEN_W + BEZEL * 2) * scale,
            height: (SCREEN_H + BEZEL * 2) * scale,
          }}
        >
          <div className="bench-bezel" style={{ transform: `scale(${scale})` }}>
            <div className="bench-glass">
              <IFEApp seat={seat} bridge={bridge} />
            </div>
          </div>
        </div>
      </div>
      <SimPanel />
    </div>
  );
}
