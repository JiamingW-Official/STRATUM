import { useFlight } from "../../flight-state/store";

const COPY = {
  safety: {
    kind: "Safety demonstration",
    title: "Please direct your attention to the cabin crew",
    body: "Your seat belt fastens and unfastens like this. There are exits fore, aft and over the wings. In the unlikely event of a loss of cabin pressure, an oxygen mask will drop in front of you.",
  },
  captain: {
    kind: "From the flight deck",
    title: "This is your captain speaking",
    body: "We have reached our cruising altitude and expect a smooth ride. I have switched off the seat belt sign, but please keep it fastened while you are seated.",
  },
} as const;

/**
 * The announcement takes the screen. There is no close control and no way to
 * reach one — this is the argument of the whole piece made literal, and it is
 * not a bug to be smoothed away. A private screen is private until it isn't,
 * and you are not the one who decides when.
 */
export function PAOverlay() {
  const paOverride = useFlight((s) => s.paOverride);
  if (!paOverride) return null;
  const c = COPY[paOverride];

  return (
    <div className="ife-pa" role="alertdialog" aria-live="assertive">
      <div className="ife-pa-inner">
        <div className="ife-cap" style={{ color: "var(--amber)" }}>
          {c.kind}
        </div>
        <div className="ife-pa-title">{c.title}</div>
        <div className="ife-pa-body">{c.body}</div>
      </div>
      <div>
        <div className="ife-pa-bar">
          <span style={{ width: "100%" }} />
        </div>
        <div className="ife-pa-foot" style={{ marginTop: 20 }}>
          <span className="ife-cap">Cabin announcement in progress</span>
          <span className="ife-cap">Your screen will return on its own</span>
        </div>
      </div>
    </div>
  );
}
