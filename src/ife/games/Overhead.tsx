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
        done ? (
          <span className="ife-cap">
            {t("score")} {score}/{QUESTIONS.length}
          </span>
        ) : null
      }
    >
      {done ? (
        <div className="ife-quiz-end">
          <div className="ife-quiz-score ife-mono">
            {score}/{QUESTIONS.length}
          </div>
          <p className="ife-quiz-why-text">{t("overheadSub")}</p>
          <button className="ife-btn ife-btn--go" onClick={again}>
            {t("playAgain")}
          </button>
        </div>
      ) : (
        /* Two columns: the question on the left at the size a question
           deserves, the answers on the right where a hand is. A quiz stacked
           down the left of a 1920-wide screen leaves half the glass dark and
           makes the reader's eye travel twice as far as it needs to. */
        <div className="ife-quiz">
          <div className="ife-quiz-ask">
            <div className="ife-quiz-n ife-mono">
              {String(i + 1).padStart(2, "0")}
              <span className="ife-quiz-n-of">/{QUESTIONS.length}</span>
            </div>
            <h3 className="ife-quiz-q">{pickQ(q.q, lang)}</h3>
            {picked !== null && (
              <div className="ife-quiz-why">
                <div className="ife-cap" data-right={picked === q.answer}>
                  {picked === q.answer ? t("correct") : t("wrong")}
                </div>
                <p className="ife-quiz-why-text">{pickQ(q.why, lang)}</p>
                <div className="ife-quiz-source ife-cap">
                  {t("source")} · {q.source}
                </div>
              </div>
            )}
          </div>

          <div className="ife-quiz-answer">
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
              <button className="ife-btn ife-btn--go" onClick={next}>
                {t("nextQuestion")} →
              </button>
            )}
          </div>
        </div>
      )}
    </GameFrame>
  );
}
