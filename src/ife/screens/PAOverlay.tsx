import { useFlight } from "../../flight-state/store";
import { useT, type Key } from "../i18n";

const COPY = {
  safety: {
    kind: "safetyKind",
    title: "safetyTitle",
    body: "safetyBody",
  },
  captain: {
    kind: "captainKind",
    title: "captainTitle",
    body: "captainBody",
  },
} as const satisfies Record<string, Record<string, Key>>;

/**
 * The announcement takes the screen. There is no close control and no way to
 * reach one — this is the argument of the whole piece made literal, and it is
 * not a bug to be smoothed away. A private screen is private until it isn't,
 * and you are not the one who decides when.
 */
export function PAOverlay() {
  const paOverride = useFlight((s) => s.paOverride);
  const { t } = useT();
  if (!paOverride) return null;
  const c = COPY[paOverride];

  return (
    <div className="ife-pa" role="alertdialog" aria-live="assertive">
      <div className="ife-pa-inner">
        <div className="ife-cap" style={{ color: "var(--accent-bright)" }}>
          {t(c.kind)}
        </div>
        <div className="ife-pa-title">{t(c.title)}</div>
        <div className="ife-pa-body">{t(c.body)}</div>
      </div>
      <div>
        <div className="ife-pa-bar">
          <span style={{ width: "100%" }} />
        </div>
        <div className="ife-pa-foot" style={{ marginTop: 20 }}>
          <span className="ife-cap">{t("announcementInProgress")}</span>
          <span className="ife-cap">{t("screenReturns")}</span>
        </div>
      </div>
    </div>
  );
}
