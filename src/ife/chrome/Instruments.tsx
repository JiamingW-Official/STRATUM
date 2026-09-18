import { useEffect, useRef, useState } from "react";
import type { FlightPosition } from "../../flight-state/types";
import { useT } from "../i18n";

/**
 * The forward view's instrument panel.
 *
 * This is drawn from the cabin the piece is referencing, down to the layout:
 * a knots tape down the left with the value boxed and the metric conversions
 * under it, a feet tape down the right with metres under it, and a compass
 * rose along the bottom with the heading boxed above it. Those are real
 * instruments and they are the right ones — a passenger looking out at the
 * ground wants to know how fast, how high, and which way.
 *
 * What is NOT here is the attitude ladder the reference has at the top. ADS-B
 * carries no attitude: a receiver hears where an aircraft is and how fast, not
 * how far its wings are banked. Drawing a pitch ladder would mean inventing
 * the one number on the panel nobody measured, on a screen whose whole subject
 * is the difference between what was heard and what was assumed. In its place
 * is vertical speed, which is the rate of change of an altitude we are given,
 * and it is marked as derived.
 *
 * Every figure here dims and goes dashed when the position behind it was not
 * heard, by the same rule as the track on the map.
 */

/**
 * The panel measures itself.
 *
 * It used to declare a 1920x1080 viewBox and stretch it to fit with
 * `preserveAspectRatio="none"`, which is fine for the tapes — they are
 * straight lines — and wrong for the one round thing on it: the map stage is
 * 1920x840, so the compass rose came out as an ellipse. Now the viewBox is
 * whatever the element actually is, one unit to the pixel, and everything is
 * placed as a fraction of that. A circle drawn in square units is a circle.
 */
function useSize(ref: React.RefObject<SVGSVGElement | null>) {
  const [size, setSize] = useState({ w: 1920, h: 840 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // clientWidth, not getBoundingClientRect: the glass is scaled by a CSS
    // transform, and a transform does not change layout. So these are the
    // panel's own pixels — 1920 by however tall the stage is — which is the
    // space the rest of this interface is laid out in.
    const measure = () => {
      if (el.clientWidth && el.clientHeight) {
        setSize({ w: el.clientWidth, h: el.clientHeight });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function Instruments({
  position,
  bearingToDest,
}: {
  position: FlightPosition;
  bearingToDest: number;
}) {
  const { t } = useT();
  const vs = useVerticalSpeed(position.altFt);
  const svg = useRef<SVGSVGElement | null>(null);
  const { w: W, h: H } = useSize(svg);
  const inferred = !position.heard;
  const cls = (base: string) => `${base}${inferred ? " ife-inst--inferred" : ""}`;

  return (
    <svg
      ref={svg}
      className={cls("ife-inst")}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <Tape
        x={Math.round(W * 0.156)}
        cy={Math.round(H * 0.44)}
        h={Math.round(H * 0.5)}
        side="left"
        unit={t("knots")}
        value={position.gsKt}
        step={10}
        labelEvery={20}
        pxPer={4}
        digits={0}
        under={[
          `${Math.round(position.gsKt * 1.852)} km/h`,
          `${Math.round(position.gsKt * 1.15078)} mph`,
        ]}
      />
      <Tape
        // Inboard of the view sidebar, which lives on the right edge.
        x={Math.round(W * 0.724)}
        cy={Math.round(H * 0.44)}
        h={Math.round(H * 0.5)}
        side="right"
        unit={t("feet")}
        value={position.altFt}
        step={20}
        labelEvery={100}
        pxPer={2.4}
        digits={0}
        under={[`${Math.round(position.altFt * 0.3048)} m`]}
        extra={{ label: t("verticalSpeed"), value: vs }}
      />
      <Rose
        cx={Math.round(W / 2)}
        cy={Math.round(H * 0.76)}
        r={Math.round(Math.min(W, H) * 0.165)}
        heading={position.headingDeg}
        toDest={bearingToDest}
      />
    </svg>
  );
}

/**
 * A moving tape. The scale slides behind a fixed box, which is how every
 * primary flight display since the seventies has shown a changing number:
 * the digit tells you the value and the tape tells you which way it is going
 * and how fast, and neither of those is legible from a number alone.
 */
function Tape({
  x,
  cy,
  h,
  side,
  unit,
  value,
  step,
  labelEvery,
  pxPer,
  under,
  extra,
}: {
  x: number;
  cy: number;
  h: number;
  side: "left" | "right";
  unit: string;
  value: number;
  step: number;
  labelEvery: number;
  pxPer: number;
  digits: number;
  under: string[];
  extra?: { label: string; value: number };
}) {
  const top = cy - h / 2;
  const span = h / 2 / pxPer;
  const first = Math.ceil((value - span) / step) * step;
  // The digits window replaces the part of the scale it covers, which is what
  // a real one does: a number showing through the box beside the number the
  // box is reading is two answers to one question.
  const windowValue = 36 / pxPer;
  const ticks: Array<{ v: number; y: number; major: boolean }> = [];
  for (let v = first; v <= value + span; v += step) {
    ticks.push({
      v,
      y: cy - (v - value) * pxPer,
      major:
        Math.abs(v % labelEvery) < 1e-6 && Math.abs(v - value) > windowValue,
    });
  }
  // Ticks inboard, numbers outboard, box outboard with its notch pointing
  // back at the scale. That is the order on the panel this is drawn from, and
  // it is the order for a reason: the box has to be able to sit over the
  // number it is reading without covering the ticks that give it its rate.
  const inward = side === "left" ? 1 : -1;
  const out = -inward;
  const rule = x;
  const tickLong = rule + inward * 26;
  const tickShort = rule + inward * 14;
  const numX = rule + out * 14;
  // The conversions line up with the outer edge of the box rather than with
  // the scale, which keeps them clear of the control column on the right.
  const underX = rule + out * 190;

  return (
    <g>
      <text
        className="ife-inst-unit"
        x={rule + out * 4}
        y={top - 26}
        textAnchor={side === "left" ? "end" : "start"}
      >
        {unit}
      </text>
      <line
        className="ife-inst-rule"
        x1={rule}
        y1={top}
        x2={rule}
        y2={top + h}
      />
      {ticks.map((tk) => (
        <g key={tk.v}>
          <line
            className="ife-inst-tick"
            x1={rule}
            y1={tk.y}
            x2={tk.major ? tickLong : tickShort}
            y2={tk.y}
            data-major={tk.major}
          />
          {tk.major && (
            <text
              className="ife-inst-tick-num"
              x={numX}
              y={tk.y + 11}
              textAnchor={side === "left" ? "end" : "start"}
            >
              {Math.round(tk.v).toLocaleString("en-US")}
            </text>
          )}
        </g>
      ))}
      {/* The box, and the notch that points at the place on the scale the box
          is reading. */}
      <g transform={`translate(${rule} ${cy})`}>
        <path
          className="ife-inst-box"
          d={
            side === "left"
              ? "M0 -34 H-190 V34 H0 l22 -34 Z"
              : "M0 -34 H190 V34 H0 l-22 -34 Z"
          }
        />
        <text
          className="ife-inst-value"
          x={out * 96}
          y={16}
          textAnchor="middle"
        >
          {Math.round(value).toLocaleString("en-US")}
        </text>
      </g>
      {under.map((u, i) => (
        <text
          key={u}
          className="ife-inst-under"
          x={underX}
          y={top + h + 54 + i * 40}
          textAnchor={side === "left" ? "start" : "end"}
        >
          {u}
        </text>
      ))}
      {extra && (
        <g>
          <text
            className="ife-inst-extra-label"
            x={underX}
            y={top + h + 118}
            textAnchor={side === "left" ? "start" : "end"}
          >
            {extra.label}
          </text>
          <text
            className="ife-inst-extra"
            x={underX}
            y={top + h + 164}
            textAnchor={side === "left" ? "start" : "end"}
          >
            {extra.value > 40 ? "▲ " : extra.value < -40 ? "▼ " : ""}
            {Math.round(extra.value).toLocaleString("en-US")}
          </text>
        </g>
      )}
    </g>
  );
}

/**
 * The compass rose, heading up. It turns under a fixed marker, so the top of
 * the rose is always where the aircraft is pointed — and the amber needle is
 * the bearing to the destination, which is the one thing a passenger actually
 * wants from a compass on a flight.
 */
function Rose({
  cx,
  cy,
  r,
  heading,
  toDest,
}: {
  cx: number;
  cy: number;
  r: number;
  heading: number;
  toDest: number;
}) {
  const ticks = [];
  for (let d = 0; d < 360; d += 5) {
    const major = d % 30 === 0;
    const a = ((d - 90) * Math.PI) / 180;
    const r1 = major ? r - 26 : r - 14;
    ticks.push(
      <line
        key={d}
        className="ife-inst-rose-tick"
        data-major={major}
        x1={cx + Math.cos(a) * r}
        y1={cy + Math.sin(a) * r}
        x2={cx + Math.cos(a) * r1}
        y2={cy + Math.sin(a) * r1}
      />,
    );
  }
  const marks = [
    [0, "N"],
    [30, "3"],
    [60, "6"],
    [90, "E"],
    [120, "12"],
    [150, "15"],
    [180, "S"],
    [210, "21"],
    [240, "24"],
    [270, "W"],
    [300, "30"],
    [330, "33"],
  ] as const;

  return (
    <g>
      {/* Boxed heading, above the rose, as the reference has it. */}
      <g transform={`translate(${cx} ${cy - r - 44})`}>
        <path className="ife-inst-box" d="M-62 -32 H62 V32 H-62 Z" />
        <text className="ife-inst-value" x={0} y={12} textAnchor="middle">
          {Math.round(((heading % 360) + 360) % 360)
            .toString()
            .padStart(3, "0")}
        </text>
      </g>
      <g transform={`rotate(${-heading} ${cx} ${cy})`}>
        {ticks}
        {marks.map(([d, s]) => {
          const a = ((d - 90) * Math.PI) / 180;
          const mx = cx + Math.cos(a) * (r - 52);
          const my = cy + Math.sin(a) * (r - 52);
          return (
            <text
              key={d}
              className="ife-inst-rose-mark"
              x={mx}
              y={my + 9}
              textAnchor="middle"
              transform={`rotate(${heading} ${mx} ${my})`}
            >
              {s}
            </text>
          );
        })}
        {/* The way to the destination. */}
        <g transform={`rotate(${toDest} ${cx} ${cy})`}>
          <path
            className="ife-inst-needle"
            d={`M${cx} ${cy - r + 16} l12 24 h-24 Z`}
          />
        </g>
      </g>
      <circle className="ife-inst-rose-hub" cx={cx} cy={cy} r={4} />
    </g>
  );
}

/**
 * Vertical speed, in feet per minute, from the altitude we are actually given.
 *
 * It is a derivative of a reported number rather than a reported number, and
 * it says so: it is labelled as derived and it is smoothed, because a rate
 * computed from two samples of a rounded altitude jitters by hundreds of feet
 * a minute even in level flight.
 */
function useVerticalSpeed(altFt: number) {
  const last = useRef<{ alt: number; t: number } | null>(null);
  const [vs, setVs] = useState(0);
  useEffect(() => {
    const now = Date.now();
    const prev = last.current;
    last.current = { alt: altFt, t: now };
    if (!prev || now - prev.t < 900) return;
    const rate = ((altFt - prev.alt) / (now - prev.t)) * 60_000;
    setVs((v) => v * 0.7 + rate * 0.3);
  }, [altFt]);
  return vs;
}
