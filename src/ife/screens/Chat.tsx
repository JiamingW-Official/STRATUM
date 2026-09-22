import { useEffect, useMemo, useRef, useState } from "react";
import { useCabin } from "../../flight-state/store";
import type { IFEBridge } from "../../flight-state/types";
import { useT } from "../i18n";
import { utcTime } from "../format";

/**
 * Seat to seat.
 *
 * Every screen in this cabin has so far been one seat looking at the flight.
 * This is the one where a seat can reach another seat, and it is the screen
 * where the three-layer state model earns its keep — because the obvious
 * place to put a message is the wrong one.
 *
 * A message is not SeatPrivate. It is in the cabin, with the reading lights,
 * because that is where it really is: on a real seat-back system a seat-to-seat
 * message goes to a server in the ceiling and stays there. So the screen says
 * so, once, quietly, at the top of the thread — and then it does not moralise
 * about it. A passenger who reads that line and sends the message anyway has
 * been told the truth, which is the only thing this work is asking for.
 *
 * The second rule is here too. A message that has actually been in front of
 * the other seat is drawn solid; one that exists only in the aircraft is drawn
 * broken, in the same brass the map uses for a stretch of flight nobody heard.
 * Nothing explains that either.
 */
const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const LIMIT = 240;

export function Chat({ seat, bridge }: { seat: string; bridge: IFEBridge }) {
  const { t, lang } = useT();
  const messages = useCabin((s) => s.messages);
  const [withSeat, setWithSeat] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const tail = useRef<HTMLDivElement | null>(null);

  /**
   * The seats you are already talking to — not the seats that are occupied.
   *
   * The first version of this listed every taken seat on the aircraft, which
   * is a manifest: it tells anyone who opens the screen exactly who is on
   * board and where they are sitting. A real system asks you to type the seat
   * number instead, and it is right to. You write to a seat you already know
   * about, and nothing here confirms whether anybody is in it.
   *
   * Which is also why a message to an empty seat is accepted and simply never
   * read. That is not an error state, it is the honest one — and it is drawn
   * the way every other unheard thing in this work is drawn.
   */
  const others = useMemo(() => {
    const set = new Set<string>();
    for (const m of messages) {
      if (m.from === seat) set.add(m.to);
      if (m.to === seat) set.add(m.from);
    }
    return [...set].sort();
  }, [messages, seat]);

  const thread = useMemo(
    () =>
      messages.filter(
        (m) =>
          (m.from === seat && m.to === withSeat) ||
          (m.from === withSeat && m.to === seat),
      ),
    [messages, seat, withSeat],
  );

  const unread = (other: string) =>
    messages.filter(
      (m) => m.to === seat && m.from === other && m.seenUtc === null,
    ).length;

  // Opening a thread is what makes its messages seen, and only the cabin can
  // record that — hence the bridge rather than a setState.
  useEffect(() => {
    if (withSeat) bridge.readThread(withSeat);
  }, [withSeat, messages.length, bridge]);

  useEffect(() => {
    tail.current?.scrollTo({ top: tail.current.scrollHeight });
  }, [thread.length]);

  const send = () => {
    if (!withSeat || !draft.trim()) return;
    bridge.sendMessage(withSeat, draft);
    setDraft("");
  };

  const key = (k: string) => {
    if (k === "⌫") return setDraft((d) => d.slice(0, -1));
    if (k === "␣") return setDraft((d) => (d.length < LIMIT ? d + " " : d));
    // What the key shows is what it types. The rows are written in capitals
    // because that is how a keyboard is drawn, and the first version put the
    // capital in the message — every note came out SHOUTING. There is no
    // shift key yet, which is a gap.
    const c = k.toLowerCase();
    setDraft((d) => (d.length < LIMIT ? d + c : d));
  };

  // The bench has a real keyboard and a seat back does not. Accepting it here
  // is a bench affordance, and it is also the only way to type anything the
  // Latin keys below cannot — the on-screen layout is Latin only, which is a
  // gap and not a decision.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!withSeat) return;
      if (e.key === "Enter") return send();
      if (e.key === "Backspace") return setDraft((d) => d.slice(0, -1));
      if (e.key.length === 1) setDraft((d) => (d.length < LIMIT ? d + e.key : d));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="ife-chat">
      <aside className="ife-chat-seats">
        <div className="ife-chat-seats-head ife-cap">{t("threads")}</div>
        <button
          className="ife-btn ife-chat-new"
          onClick={() => {
            setAddress("");
            setWithSeat(null);
          }}
        >
          {t("newMessage")}
        </button>
        {others.map((other) => {
          const n = unread(other);
          const last = [...messages]
            .reverse()
            .find(
              (m) =>
                (m.from === other && m.to === seat) ||
                (m.from === seat && m.to === other),
            );
          return (
            <button
              key={other}
              className="ife-chat-seat"
              data-on={withSeat === other}
              onClick={() => {
                setAddress(null);
                setWithSeat(other);
              }}
            >
              <span className="ife-chat-seat-no ife-mono">{other}</span>
              <span className="ife-chat-seat-last">
                {last ? last.text : t("noMessages")}
              </span>
              {n > 0 && <span className="ife-chat-unread ife-mono">{n}</span>}
            </button>
          );
        })}
      </aside>

      <section className="ife-chat-thread">
        {address !== null ? (
          <SeatEntry
            value={address}
            onChange={setAddress}
            onDone={(to) => {
              setAddress(null);
              setWithSeat(to);
            }}
          />
        ) : withSeat === null ? (
          /* The same header every other screen has, at the top where they
             all put it, and one line under it rather than a paragraph.
             
             This was a title and a three-clause explanation floating in the
             middle of the panel — the only vertically centred screen in the
             cabin — and the column beside it said "Nothing yet. Write to a
             seat and it will appear here." at the same time. Two empty
             states, in different words, about the same emptiness. */
          <div className="ife-chat-blank">
            <header className="ife-head">
              <h2 className="ife-head-title">{t("chat")}</h2>
              <span className="ife-head-meta ife-cap">{t("noMessages")}</span>
            </header>
            <p>{t("pickASeat")}</p>
          </div>
        ) : (
          <>
            <header className="ife-chat-head">
              <h2 className="ife-head-title ife-mono">{withSeat}</h2>
              {/* Said once, and not again. */}
              <span className="ife-chat-held ife-cap">{t("heldByAircraft")}</span>
            </header>

            <div className="ife-chat-log" ref={tail}>
              {thread.map((m) => (
                <div
                  key={m.id}
                  className="ife-chat-msg"
                  data-mine={m.from === seat}
                  data-seen={m.seenUtc !== null}
                >
                  <span className="ife-chat-msg-text">{m.text}</span>
                  <span className="ife-chat-msg-meta ife-mono">
                    {utcTime(m.sentUtc)}
                    {m.from === seat
                      ? ` · ${m.seenUtc ? t("seen") : t("notSeen")}`
                      : ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="ife-chat-compose">
              <div className="ife-chat-draft" aria-live="polite">
                {draft || <span className="ife-chat-draft-empty">{t("typeHere")}</span>}
              </div>
              <div className="ife-keys">
                {ROWS.map((row) => (
                  <div key={row} className="ife-keys-row">
                    {row.split("").map((k) => (
                      <button key={k} className="ife-key" onClick={() => key(k)}>
                        {lang === "zh" ? k : k.toLowerCase()}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="ife-keys-row">
                  <button className="ife-key" onClick={() => key(",")}>
                    ,
                  </button>
                  <button
                    className="ife-key ife-key--wide"
                    onClick={() => key("␣")}
                  >
                    ␣
                  </button>
                  <button className="ife-key" onClick={() => key(".")}>
                    .
                  </button>
                  <button className="ife-key" onClick={() => key("⌫")}>
                    ⌫
                  </button>
                  <button
                    className="ife-key ife-key--send"
                    onClick={send}
                    disabled={!draft.trim()}
                  >
                    {t("send")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/**
 * Addressing a message: a row number and a letter, on a pad.
 *
 * Nothing here checks whether that seat exists or whether anyone is in it.
 * Checking would answer a question the screen has no business answering, and
 * the unanswered message already says everything true about an empty seat.
 */
function SeatEntry({
  value,
  onChange,
  onDone,
}: {
  value: string;
  onChange: (v: string) => void;
  onDone: (seat: string) => void;
}) {
  const { t } = useT();
  const ok = /^\d{1,2}[A-K]$/.test(value);
  return (
    <div className="ife-chat-address">
      <h2 className="ife-chat-blank-title">{t("writeToSeat")}</h2>
      <div className="ife-chat-address-value ife-mono">
        {value || <span className="ife-chat-draft-empty">00A</span>}
      </div>
      <div className="ife-keys ife-keys--seat">
        <div className="ife-keys-row">
          {"123456789".split("").map((d) => (
            <button
              key={d}
              className="ife-key"
              onClick={() => onChange((value + d).slice(0, 3))}
            >
              {d}
            </button>
          ))}
          <button
            key="0"
            className="ife-key"
            onClick={() => onChange((value + "0").slice(0, 3))}
          >
            0
          </button>
        </div>
        <div className="ife-keys-row">
          {"ABCDEFGHJK".split("").map((l) => (
            <button
              key={l}
              className="ife-key"
              onClick={() => onChange((value + l).slice(0, 3))}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="ife-keys-row">
          <button className="ife-key" onClick={() => onChange(value.slice(0, -1))}>
            ⌫
          </button>
          <button
            className="ife-key ife-key--send"
            disabled={!ok}
            onClick={() => onDone(value)}
          >
            {t("openThread")}
          </button>
        </div>
      </div>
    </div>
  );
}
