import { useSelf } from "../../flight-state/store";
import type { Lang } from "../i18n";
import { useT } from "../i18n";

/**
 * The language, on its own screen.
 *
 * It was a popover hanging off a placard in the rail, which is where a
 * setting goes. This is not a setting: it is the first question a seat-back
 * system asks, before it knows anything about you, and every cabin gives it
 * the whole glass — because a passenger who cannot read the interface cannot
 * find the control that would let them read it.
 *
 * Each option is written in its own language and nothing else. "Chinese" is
 * only useful to somebody who already reads English.
 */
const LANGUAGES: Array<{ code: Lang; name: string; note: string }> = [
  { code: "en", name: "English", note: "English" },
  { code: "zh", name: "中文", note: "Chinese" },
];

export function Language({ onDone }: { onDone?: () => void }) {
  const lang = useSelf((s) => s.lang);
  const setLang = useSelf((s) => s.setLang);
  const { t } = useT();

  return (
    <div className="ife-lang-screen">
      <h2 className="ife-lang-title">{t("chooseLanguage")}</h2>
      <div className="ife-lang-grid">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            className="ife-lang-card"
            data-on={lang === l.code}
            onClick={() => {
              setLang(l.code);
              onDone?.();
            }}
          >
            <span className="ife-lang-name">{l.name}</span>
            <span className="ife-lang-note ife-cap">{l.note}</span>
          </button>
        ))}
      </div>
      {onDone && (
        <button className="ife-btn ife-lang-skip" onClick={onDone}>
          {t("continue")}
        </button>
      )}
    </div>
  );
}
