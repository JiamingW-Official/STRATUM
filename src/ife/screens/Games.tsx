import { useState } from "react";
import { useT } from "../i18n";
import { IconGames, IconSky } from "../chrome/icons";
import { Sudoku } from "../games/Sudoku";
import { Overhead } from "../games/Overhead";

/**
 * Two games, both real. A seat-back system's games are the part passengers
 * reach for when the film is over and the sleep will not come, so they have to
 * work offline, need no account, and end when you stop.
 *
 * One is the classic every cabin carries. The other is this work's own
 * subject, because the brief asks for a cabin where people learn something
 * together and what this work knows is what is overhead.
 */
export function Games() {
  const { t } = useT();
  const [open, setOpen] = useState<null | "sudoku" | "overhead">(null);

  if (open === "sudoku") return <Sudoku onBack={() => setOpen(null)} />;
  if (open === "overhead") return <Overhead onBack={() => setOpen(null)} />;

  const items = [
    {
      id: "sudoku" as const,
      icon: <IconGames size={84} />,
      name: t("sudoku"),
      sub: t("sudokuSub"),
    },
    {
      id: "overhead" as const,
      icon: <IconSky size={84} />,
      name: t("overhead"),
      sub: t("overheadSub"),
    },
  ];

  return (
    <div className="ife-pad">
      <div className="ife-films-head">
        <h2 className="ife-title">{t("games")}</h2>
      </div>
      <div className="ife-gamegrid">
        {items.map((g) => (
          <button
            key={g.id}
            className="ife-gamecard"
            onClick={() => setOpen(g.id)}
          >
            <span className="ife-gamecard-icon">{g.icon}</span>
            <span className="ife-gamecard-name">{g.name}</span>
            <span className="ife-gamecard-sub">{g.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shared chrome so a game's own header is not reinvented twice. */
export function GameFrame({
  title,
  onBack,
  aside,
  children,
}: {
  title: string;
  onBack: () => void;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useT();
  return (
    <div className="ife-game">
      <header className="ife-game-head">
        <button className="ife-btn ife-btn--quiet" onClick={onBack}>
          ← {t("games")}
        </button>
        <h2 className="ife-game-title">{title}</h2>
        <span className="ife-rail-spacer" />
        {aside}
      </header>
      {children}
    </div>
  );
}
