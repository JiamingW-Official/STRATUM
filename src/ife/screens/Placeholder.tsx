import { useSelf } from "../../flight-state/store";
import { useT, type Key } from "../i18n";

/**
 * Movies and games are named on the home screen and lead somewhere rather than
 * nowhere, but there is nothing behind them yet and the screen says so plainly
 * instead of showing invented posters. A catalogue of films that do not exist
 * would be the one thing in this cabin that is not true.
 */
export function Placeholder({ titleKey }: { titleKey: Key }) {
  const setScreen = useSelf((s) => s.setScreen);
  const { t } = useT();
  return (
    <div className="ife-pad">
      <div className="ife-soon">
        <div className="ife-title">{t(titleKey)}</div>
        <div className="ife-soon-text">
          {t("nothingLoaded")} {t("catalogueLater")}
        </div>
        <div style={{ marginTop: 44 }}>
          <button className="ife-btn" onClick={() => setScreen("home")}>
            ← {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
