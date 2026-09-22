import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import { pick, useT } from "../i18n";
import { aislesFor, price } from "../shop";
import { Ware } from "../chrome/Ware";

/**
 * The trolley, as a guide you scroll.
 *
 * Not a list and not a grid of photographs. A guide: one aisle per band, the
 * band's name held at the left where a reader's eye comes back to it, and the
 * things themselves in a row beside it. Down rather than across, because a
 * catalogue is read in one direction and a rail of doors is pushed in the
 * other — the home screen already owns the sideways gesture, and a screen
 * that uses both is a screen you have to work out.
 *
 * The pictures are the cabin's own: a render where one has been made, the
 * drawn silhouette where one has not. Ware.tsx holds the rule about which
 * pictures may be here at all.
 *
 * Nothing is buyable here. A screen that took a card number would be the one
 * place in this cabin asking for something it cannot keep safe, and the real
 * answer on a real aircraft is the honest answer here too: the trolley comes
 * to you. The foot says when, and that is the whole of the transaction.
 */
export function Shop() {
  const { t, lang } = useT();
  const seat = useSelf((s) => s.seat);
  const cabin = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const { route } = useFlight();
  const aisles = aislesFor(cabin);

  return (
    <div className="ife-shop">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("dutyFree")}</h2>
        <span className="ife-head-meta ife-cap">
          {t(`${cabin}Class` as "economyClass")} · {route.from.iata} →{" "}
          {route.to.iata}
        </span>
      </header>

      <div className="ife-shop-scroll">
        {aisles.map((a) => (
          <section key={a.key} className="ife-shop-band">
            <div className="ife-shop-band-name">
              <h3 className="ife-cap">{pick(a.title, lang)}</h3>
            </div>
            <div className="ife-shop-wares">
              {a.items.map((i) => (
                <article key={i.id} className="ife-ware-card">
                  <Ware item={i} />
                  <span className="ife-ware-name">{pick(i.name, lang)}</span>
                  <span className="ife-ware-note">{pick(i.note, lang)}</span>
                  <span className="ife-ware-foot">
                    <span className="ife-ware-measure ife-mono">
                      {i.measure ?? ""}
                    </span>
                    <span className="ife-ware-price ife-mono">
                      {price(i.price)}
                    </span>
                  </span>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Inside the scroller, at the end of the goods, where a catalogue
            puts its terms — not pinned to the foot of the screen, where it
            would be a disclaimer following you down the page. */}
        <p className="ife-shop-note-foot">{t("shopNote")}</p>
      </div>
    </div>
  );
}
