import { useCallback, useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFlight } from "../../flight-state/store";
import { arc, greatCircleKm } from "../../flight-state/geo";
import { fmtInt } from "../format";
import { pick, useT } from "../i18n";
import { nightRing } from "../sun";
import { IconMinus, IconPlus, IconRoute, IconTarget } from "../chrome/icons";

/**
 * Basemap: Esri's World Dark Gray, as raster tiles, in two layers.
 *
 * Chosen because it needs no API key and because the sky view already runs on
 * it — CARTO stamps "API KEY REQUIRED" across every keyless tile, and a
 * moving map is not the place to take a second unproven tile host as a
 * dependency. The limits are real and worth stating: it is a courtesy service
 * with no SLA, it is raster so the labels cannot be restyled or translated,
 * and the attribution below the map is required, not decorative.
 *
 * The second layer is the reason this map reads as a map now. Esri ships the
 * ground and the names as separate services, and only the ground was being
 * drawn: a passenger looking for where they were flying over got grey shapes
 * with nothing named on any of them. The Reference layer is the real
 * cartography — every label placed by someone who does this properly, at
 * every zoom, in the right position, which is not something a handful of
 * hand-placed city dots was ever going to imitate.
 */
const BASE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";

const FLOWN_HEARD = "flown-heard";
const FLOWN_UNHEARD = "flown-unheard";
const AHEAD = "ahead";
const NIGHT = "night";

/**
 * Who the camera belongs to.
 *
 * A seat-back map that cannot be touched is a screensaver, and one that can
 * only be touched is useless — pan away once and you have lost the aircraft.
 * So the camera has two modes the system drives and one the passenger does,
 * and the moment a finger moves the map it becomes theirs. The two buttons
 * take it back, which is the whole contract.
 */
type Camera = "route" | "aircraft" | "free";

export function MapScreen() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const apRef = useRef<Marker[]>([]);
  const [failed, setFailed] = useState(false);
  // The style's load event fires once and may already have fired by the time
  // the data effect runs, so readiness is state rather than a listener.
  const [ready, setReady] = useState(false);
  const [camera, setCamera] = useState<Camera>("route");
  const { route, position, track } = useFlight();
  const { t, lang } = useT();

  // Create once. Everything after this is a data update, never a rebuild:
  // a map that tears itself down on every position fix would flash forever.
  useEffect(() => {
    if (!ref.current) return;
    let map: MLMap;
    try {
      map = new MLMap({
        container: ref.current,
        style: {
          version: 8,
          sources: {
            base: {
              type: "raster",
              tiles: [BASE],
              tileSize: 256,
              maxzoom: 16,
              attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors",
            },
            labels: {
              type: "raster",
              tiles: [LABELS],
              tileSize: 256,
              maxzoom: 16,
            },
          },
          layers: [
            {
              id: "bg",
              type: "background",
              paint: { "background-color": "#070a0f" },
            },
            {
              id: "base",
              type: "raster",
              source: "base",
              paint: { "raster-opacity": 0.82, "raster-saturation": -0.2 },
            },
          ],
        },
        center: [route.from.lon, route.from.lat],
        zoom: 2,
        attributionControl: { compact: true },
        // The passenger's map. Rotation and pitch stay off: a moving map that
        // can end up upside down is a toy, and north-up is the one thing
        // every passenger already knows about a map.
        interactive: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        minZoom: 1,
        maxZoom: 11,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;
    map.touchZoomRotate.disableRotation();
    setReady(false);
    if (import.meta.env.DEV) (window as any).__ifeMap = map;

    map.on("error", () => setFailed(true));
    map.on("load", () => {
      const empty = { type: "FeatureCollection", features: [] } as const;
      for (const id of [NIGHT, AHEAD, FLOWN_UNHEARD, FLOWN_HEARD]) {
        map.addSource(id, { type: "geojson", data: empty as any });
      }

      // Night, under the names and over the ground. Every seat-back map has
      // this line, and it is the only thing on one that is not about the
      // aircraft: it is why the shade beside you is down.
      map.addLayer({
        id: NIGHT,
        type: "fill",
        source: NIGHT,
        paint: { "fill-color": "#03060e", "fill-opacity": 0.52 },
      });
      // The terminator's own edge, cool and faint — the sky view's colour for
      // the part of a flight that has not happened, doing the same job here.
      map.addLayer({
        id: `${NIGHT}-edge`,
        type: "line",
        source: NIGHT,
        paint: {
          "line-color": "#6aadcc",
          "line-width": 1.2,
          "line-opacity": 0.3,
        },
      });

      map.addLayer({
        id: "labels",
        type: "raster",
        source: "labels",
        paint: { "raster-opacity": 0.9 },
      });

      // Route still to fly: dashed and dim. It has not happened, so under the
      // evidence rule it cannot be drawn solid.
      map.addLayer({
        id: AHEAD,
        type: "line",
        source: AHEAD,
        paint: {
          "line-color": "#7f8894",
          "line-width": 2,
          "line-dasharray": [2, 3],
          "line-opacity": 0.75,
        },
      });
      // Flown but unheard: also dashed, but amber — a different kind of
      // absence from "hasn't happened yet".
      map.addLayer({
        id: FLOWN_UNHEARD,
        type: "line",
        source: FLOWN_UNHEARD,
        paint: {
          "line-color": "#c9a45c",
          "line-width": 2.5,
          "line-dasharray": [1.6, 2.2],
        },
      });
      // Flown and heard: solid. The only solid line on the map.
      map.addLayer({
        id: FLOWN_HEARD,
        type: "line",
        source: FLOWN_HEARD,
        paint: { "line-color": "#f0ece2", "line-width": 3 },
      });
      setReady(true);
    });

    // A finger on the map takes the camera. MapLibre's own eased moves carry
    // no originalEvent, which is exactly how a gesture is told apart from the
    // two buttons calling fitBounds.
    const seize = (e: any) => {
      if (e?.originalEvent) setCamera("free");
    };
    map.on("dragstart", seize);
    map.on("zoomstart", seize);

    const el = document.createElement("div");
    el.className = "ife-plane-marker";
    el.innerHTML = PLANE_SVG;
    markerRef.current = new Marker({ element: el, rotationAlignment: "map" })
      .setLngLat([route.from.lon, route.from.lat])
      .addTo(map);

    // The two ends of the flight, named. The dot is the airport and the label
    // hangs off it, so the marker is anchored by its left edge and the dot is
    // pulled back over the coordinate by half its own width.
    apRef.current = (["from", "to"] as const).map((role) => {
      const ap = route[role];
      const node = document.createElement("div");
      node.className = "ife-ap-marker";
      node.dataset.role = role;
      const inner = document.createElement("div");
      inner.className = "ife-ap-inner";
      inner.innerHTML =
        `<span class="ife-ap-dot"></span>` +
        `<span class="ife-ap-text"><span class="ife-ap-code ife-mono"></span>` +
        `<span class="ife-ap-city"></span></span>`;
      node.appendChild(inner);
      node.querySelector(".ife-ap-code")!.textContent = ap.iata;
      node.querySelector(".ife-ap-city")!.textContent = pick(ap.city, lang);
      return new Marker({ element: node, anchor: "left" })
        .setLngLat([ap.lon, ap.lat])
        .addTo(map);
    });

    return () => {
      for (const m of apRef.current) m.remove();
      apRef.current = [];
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [route.from.iata, route.to.iata]);

  // The airport labels follow the language without rebuilding the map.
  useEffect(() => {
    for (const [i, role] of (["from", "to"] as const).entries()) {
      const el = apRef.current[i]?.getElement();
      const city = el?.querySelector(".ife-ap-city");
      if (city) city.textContent = pick(route[role].city, lang);
    }
  }, [lang, route.from.iata, route.to.iata]);

  const fitRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const line = arc(route.from, route.to);
    const bounds = line.reduce(
      (b, c) => b.extend(c as [number, number]),
      new LngLatBounds(line[0] as [number, number], line[0] as [number, number]),
    );
    // Room on the left for the readout and on the right for the controls.
    // Room for the readout along the bottom, and enough on the right that the
    // destination's own label clears the controls rather than sliding under
    // them — the padding has to hold the dot *and* the name hanging off it.
    map.fitBounds(bounds, {
      padding: { top: 150, bottom: 230, left: 170, right: 400 },
      duration: 600,
    });
  }, [route.from, route.to]);

  // Whichever camera is in force, applied when it changes and when the thing
  // it follows moves. "free" is the passenger's, and nothing touches it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (camera === "route") fitRoute();
    if (camera === "aircraft") {
      map.easeTo({
        center: [position.lon, position.lat],
        zoom: Math.max(map.getZoom(), 5),
        // The aircraft sits low in the frame, because what a passenger wants
        // from this view is what is coming, not what has gone.
        offset: [0, 150],
        duration: 700,
      });
    }
  }, [camera, ready, fitRoute, position.lat, position.lon]);

  // Night, recomputed on the minute. The sun moves 0.25° of longitude in that
  // time, which is about a pixel at this zoom.
  useEffect(() => {
    if (!ready) return;
    const paint = () => {
      const src = mapRef.current?.getSource(NIGHT) as any;
      src?.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: [nightRing(new Date())] },
          },
        ],
      });
    };
    paint();
    const id = window.setInterval(paint, 60_000);
    return () => window.clearInterval(id);
  }, [ready]);

  // Track and aircraft.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const apply = () => {
      const heard: Array<Array<[number, number]>> = [];
      const unheard: Array<Array<[number, number]>> = [];
      let run: Array<[number, number]> = [];
      let runHeard = track[0]?.heard ?? true;
      for (const p of track) {
        if (p.heard !== runHeard) {
          // Carry the joining point into both runs so the line has no hole
          // where the evidence changed.
          run.push([p.lon, p.lat]);
          (runHeard ? heard : unheard).push(run);
          run = [[p.lon, p.lat]];
          runHeard = p.heard;
        } else {
          run.push([p.lon, p.lat]);
        }
      }
      if (run.length > 1) (runHeard ? heard : unheard).push(run);

      const fc = (lines: Array<Array<[number, number]>>) => ({
        type: "FeatureCollection",
        features: lines
          .filter((l) => l.length > 1)
          .map((coordinates) => ({
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates },
          })),
      });

      (map.getSource(FLOWN_HEARD) as any)?.setData(fc(heard));
      (map.getSource(FLOWN_UNHEARD) as any)?.setData(fc(unheard));
      (map.getSource(AHEAD) as any)?.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: arc(position, route.to),
            },
          },
        ],
      });
    };
    apply();

    const el = markerRef.current?.getElement();
    if (el) {
      el.dataset.heard = String(position.heard);
      const svg = el.firstElementChild as SVGElement | null;
      if (svg) svg.style.transform = `rotate(${position.headingDeg}deg)`;
    }
    markerRef.current?.setLngLat([position.lon, position.lat]);
  }, [ready, track, position, route.to.iata]);

  const zoom = (by: number) => () =>
    mapRef.current?.easeTo({
      zoom: (mapRef.current?.getZoom() ?? 3) + by,
      duration: 320,
    });

  return (
    <div className="ife-map">
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      {failed && (
        <div className="ife-map-fail">
          <div className="ife-title">{t("mapUnavailable")}</div>
          <div style={{ marginTop: 18 }}>{t("mapUnavailableBody")}</div>
        </div>
      )}

      {/* On-glass controls rather than MapLibre's own: theirs ship a compass
          nobody can use on a north-up map, at a size made for a mouse. */}
      <div className="ife-mapctl">
        <button className="ife-mapbtn" aria-label={t("zoomIn")} onClick={zoom(1)}>
          <IconPlus size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("zoomOut")}
          onClick={zoom(-1)}
        >
          <IconMinus size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("followAircraft")}
          data-on={camera === "aircraft"}
          onClick={() => setCamera("aircraft")}
        >
          <IconTarget size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("wholeRoute")}
          data-on={camera === "route"}
          onClick={() => setCamera("route")}
        >
          <IconRoute size={36} />
        </button>
      </div>

      <div className="ife-map-readout">
        <Readout
          label={t("altitude")}
          value={fmtInt(position.altFt)}
          unit="ft"
          inferred={!position.heard}
        />
        <Readout
          label={t("groundSpeed")}
          value={fmtInt(position.gsKt)}
          unit="kt"
          inferred={!position.heard}
        />
        <Readout
          label={t("heading")}
          value={`${Math.round(position.headingDeg).toString().padStart(3, "0")}°`}
          inferred={!position.heard}
        />
        <Readout
          label={t("distanceToGo")}
          value={fmtInt(greatCircleKm(position, route.to))}
          unit="km"
          inferred={!position.heard}
        />
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  unit,
  inferred,
}: {
  label: string;
  value: string;
  unit?: string;
  inferred?: boolean;
}) {
  return (
    <div>
      <div className="ife-cap">{label}</div>
      <div className={`ife-figure-value ife-mono${inferred ? " ife-inferred" : ""}`}>
        {value}
        {unit && <span className="ife-figure-unit">{unit}</span>}
      </div>
    </div>
  );
}

// Filled when a receiver has the aircraft, hollow and broken when the position
// is our belief rather than its report.
const PLANE_SVG = `<svg width="38" height="38" viewBox="0 0 24 24" style="display:block">
  <path d="M12 2.5 13.6 10 22 13.4v1.9l-8.4-2.3-.5 4.9 3 2.2v1.4L12 20.3l-4.1 1.2v-1.4l3-2.2-.5-4.9L2 15.3v-1.9L10.4 10z"/>
</svg>`;
