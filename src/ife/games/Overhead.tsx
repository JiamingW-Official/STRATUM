import { useState } from "react";
import { useT } from "../i18n";
import { GameFrame } from "../screens/Games";
import { QUESTIONS, pickQ } from "./questions";

/**
 * Six questions about the sky the aircraft is in, each carrying where its
 * answer comes from. An in-flight trivia round that cites its sources is an
 * odd object, which is rather the point: the piece would rather be checkable
 * than clever.
 */
export function Overhead({ onBack }: { onBack: () => void }) {
  const { t, lang } = useT();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUESTIONS[i];

  const choose = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i + 1 >= QUESTIONS.length) return setDone(true);
    setI(i + 1);
    setPicked(null);
  };

  const again = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <GameFrame
      title={t("overhead")}
      onBack={onBack}
      aside={
        <span className="ife-cap">
          {done
            ? `${t("score")} ${score}/${QUESTIONS.length}`
            : `${t("question")} ${i + 1} ${t("ofN")} ${QUESTIONS.length}`}
        </span>
      }
    >
      {done ? (
        <div className="ife-quiz-end">
          <div className="ife-quiz-score ife-mono">
            {score}/{QUESTIONS.length}
          </div>
          <p className="ife-soon-text">{t("overheadSub")}</p>
          <button className="ife-btn ife-btn--go" onClick={again}>
            {t("playAgain")}
          </button>
        </div>
      ) : (
        <div className="ife-quiz">
          <h3 className="ife-quiz-q">{pickQ(q.q, lang)}</h3>

          <div className="ife-quiz-options">
            {q.options.map((o, n) => (
              <button
                key={n}
                className="ife-quiz-option"
                data-picked={picked === n}
                data-right={picked !== null && n === q.answer}
                data-wrong={picked === n && n !== q.answer}
                onClick={() => choose(n)}
              >
                <span className="ife-quiz-letter ife-mono">
                  {String.fromCharCode(65 + n)}
                </span>
                {pickQ(o, lang)}
              </button>
            ))}
          </div>

          {picked !== null && (
            <div className="ife-quiz-why">
              <div className="ife-cap" data-right={picked === q.answer}>
                {picked === q.answer ? t("correct") : t("wrong")}
              </div>
              <p className="ife-quiz-why-text">{pickQ(q.why, lang)}</p>
              <div className="ife-quiz-source ife-cap">
                {t("source")} · {q.source}
              </div>
              <button className="ife-btn ife-btn--go" onClick={next}>
                {t("nextQuestion")}
              </button>
            </div>
          )}
        </div>
      )}
    </GameFrame>
  );
}
