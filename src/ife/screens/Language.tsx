import { useSelf } from "../../flight-state/store";
import { LANGUAGES, useT } from "../i18n";

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
 * only useful to somebody who already reads English — which this file said
 * and then rendered anyway: every card carried its own name a second time in
 * grey caps, and the English one carried the word "English" twice.
 *
 * The list itself lives in i18n beside the dictionaries it selects between,
 * so a language is added in one place.
 */
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
          </button>
        ))}
      </div>
      {onDone && (
        <div className="ife-lang-foot">
          <button className="ife-btn" onClick={onDone}>
            {t("continue")}
          </button>
        </div>
      )}
    </div>
  );
}
