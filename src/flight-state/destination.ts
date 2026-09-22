import { useEffect, useState } from "react";
import type { Airport } from "./types";

/**
 * Photographs of the city you are flying to.
 *
 * Source: Wikipedia's REST summary endpoint, which needs no key and answers
 * with CORS. Two things to say plainly about it. First, a real seat-back
 * system carries its media on the aircraft — this one reaches out to the
 * network, which is a bench affordance, not how the cabin will work; the
 * cabin will carry a manifest loaded before pushback. Second, the images are
 * Wikimedia Commons uploads under their own licences, so the credit line
 * under each photograph is required, not decoration.
 */
export type Destination = {
  title: string;
  /** Full-width image, or null when the city has no lead photograph. */
  image: string | null;
  /**
   * The 330px render, for a caller that is drawing a header rather than a
   * whole screen.
   *
   * The seat-back screen wants the biggest file there is because it fills a
   * thirteen-inch display with it; a phone drawing a 200pt band behind two
   * lines of type does not, and the raw upload for a city is routinely several
   * megabytes. Soft is fine at that size — it is dimmed ground behind type.
   */
  thumb: string | null;
  /** Commons file name, for the credit line. */
  credit: string | null;
  creditHref: string | null;
  extract: string;
};

const cache = new Map<string, Promise<Destination | null>>();

async function fetchDestination(title: string): Promise<Destination | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) return null;
  const d = await res.json();
  // `originalimage` is the one wide render that is certain to exist: asking the
  // thumbnailer for an arbitrary width is refused outright from some networks
  // (measured — every size but the cached 330px came back 400), and for very
  // large files the API hands back a 3840px render rather than the raw upload.
  // The small thumbnail is the fallback; it is soft, but it is only ever a
  // dimmed ground behind type.
  const big: string | undefined = d.originalimage?.source;
  const thumb: string | undefined = d.thumbnail?.source;
  const file = (big ?? thumb)?.split("/").pop()?.split("?")[0] ?? null;
  return {
    title: d.title ?? title,
    image: big ?? thumb ?? null,
    thumb: thumb ?? big ?? null,
    credit: file ? decodeURIComponent(file) : null,
    creditHref: file
      ? `https://commons.wikimedia.org/wiki/File:${file.split("?")[0]}`
      : null,
    extract: d.extract ?? "",
  };
}

/**
 * Null is allowed, because a caller may not know yet where it is going.
 *
 * The booking app asks for this at the top of its component, before it has
 * worked out whether there is a flight today at all — and a hook that cannot
 * be called until the answer is known is a hook that has to be called after a
 * conditional return, which React does not allow.
 */
export function useDestination(airport: Airport | null) {
  // An airport may name the article to use. It matters: asking Wikipedia for
  // "Singapore" returns the national flag, and a flag is not a city.
  const city = airport ? (airport.photoTitle ?? airport.city.en) : null;
  const [data, setData] = useState<Destination | null>(null);

  useEffect(() => {
    if (!city) return;
    let live = true;
    if (!cache.has(city)) {
      // A city with no article, or no network, is a missing photograph and
      // nothing worse — the screen has a layout for that.
      cache.set(
        city,
        fetchDestination(city).catch(() => null),
      );
    }
    cache.get(city)!.then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [city]);

  return data;
}
