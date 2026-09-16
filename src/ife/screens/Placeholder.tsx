import { useSelf } from "../../flight-state/store";

/**
 * Movies, music and games are named on the home screen and lead somewhere
 * rather than nowhere, but there is nothing behind them yet and the screen
 * says so plainly instead of showing invented posters.
 */
export function Placeholder({ title, zh }: { title: string; zh: string }) {
  const setScreen = useSelf((s) => s.setScreen);
  return (
    <div className="ife-pad">
      <div className="ife-soon">
        <div className="ife-title">
          {title}
          <span className="ife-cap" style={{ marginLeft: 20, letterSpacing: 0 }}>
            {zh}
          </span>
        </div>
        <div className="ife-soon-text">
          Nothing loaded on this aircraft yet. The catalogue comes later, once
          the cabin exists to sit in.
        </div>
        <div style={{ marginTop: 44 }}>
          <button className="ife-tool" onClick={() => setScreen("home")}>
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
