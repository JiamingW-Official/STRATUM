import { useCallback, useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFlight } from "../../flight-state/store";
import { arc, bearing, greatCircleKm } from "../../flight-state/geo";
import { fmtInt } from "../format";
import { pick, useT } from "../i18n";
import { nightRing, terminatorLine } from "../sun";
import { Instruments } from "../chrome/Instruments";
import {
  IconForward,
  IconMinus,
  IconPlanet,
  IconPlus,
  IconRoute,
  IconTarget,
} from "../chrome/icons";

/**
 * The moving map, on a real globe.
 *
 * Every tile service here is keyless and every one of them is named in the
 * attribution, because a seat-back map that quietly borrows someone's tiles is
 * the same kind of dishonesty this whole piece is about.
 *
 *   imagery  Esri World Imagery. The earth as it is photographed, which is
 *            what "a real globe" means and what the reference cabin shows —
 *            a cartographic grey is a diagram of the earth, not the earth.
 *   places   Esri's Boundaries and Places, the transparent label layer made
 *            to go over imagery. Esri ships the ground and the names as
 *            separate services; drawing only the ground leaves a passenger
 *            looking at unnamed shapes.
 *   dem      Terrarium elevation tiles from the AWS Open Data registry, used
 *            only in the forward view, where the ground has to have relief
 *            for the view to mean anything.
 */
const IMAGERY =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const PLACES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";
const DEM =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

const FLOWN_HEARD = "flown-heard";
const FLOWN_UNHEARD = "flown-unheard";
const AHEAD = "ahead";
const NIGHT = "night";
const TERMINATOR = "terminator";

/**
 * Who the camera belongs to, and where it is standing.
 *
 * A seat-back map that cannot be touched is a screensaver, and one that can
 * only be touched is useless — pan away once and you have lost the aircraft.
 * So the camera has four places the system will put it and one the passenger
 * does, and the moment a finger moves the map it becomes theirs.
 *
 * The four are the ones a real cabin offers, in the order a real cabin offers
 * them: the whole planet, the whole flight, overhead, and looking forward
 * from the aircraft at the country ahead.
 */
type View = "globe" | "route" | "aircraft" | "forward" | "free";

export function MapScreen() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const apRef = useRef<Marker[]>([]);
  const [failed, setFailed] = useState(false);
  // The style's load event fires once and may already have fired by the time
  // the data effect runs, so readiness is state rather than a listener.
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("route");
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
          projection: { type: "globe" },
          // The atmosphere. On a globe this is what makes the limb read as a
          // planet rather than a circle with a picture in it, and in the
          // forward view it is the haze the horizon sits in. The colour is the
          // sky view's own cool. It is a root property of the style, not a
          // layer: as a layer it is simply ignored.
          sky: {
            "sky-color": "#0a1a30",
            "horizon-color": "#6aadcc",
            "fog-color": "#08101c",
            "sky-horizon-blend": 0.55,
            "horizon-fog-blend": 0.5,
            "fog-ground-blend": 0.72,
            "atmosphere-blend": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.95,
              5,
              0.7,
              9,
              0.2,
            ],
          },
          sources: {
            imagery: {
              type: "raster",
              tiles: [IMAGERY],
              tileSize: 256,
              maxzoom: 16,
              attribution:
                "Esri, Maxar, Earthstar Geographics, HERE, Garmin, © OpenStreetMap contributors, Mapzen/AWS",
            },
            places: {
              type: "raster",
              tiles: [PLACES],
              tileSize: 256,
              maxzoom: 16,
            },
            dem: {
              type: "raster-dem",
              tiles: [DEM],
              tileSize: 256,
              maxzoom: 13,
              encoding: "terrarium",
            },
          },
          layers: [
            {
              id: "imagery",
              type: "raster",
              source: "imagery",
              paint: {
                // Turned down a little, and only a little: the cabin is dark
                // and a full-brightness daylight earth is the one thing on
                // this glass that would glow. Taking it further would be
                // inventing a planet rather than showing one.
                "raster-brightness-max": 0.88,
                "raster-saturation": -0.12,
              },
            },
          ],
        },
        center: [route.from.lon, route.from.lat],
        zoom: 2,
        attributionControl: { compact: true },
        // The passenger's map. Rotation and pitch are on, because the views
        // that need them are the point; the bearing is still always the
        // system's in the three level views, which are north-up.
        interactive: true,
        maxPitch: 80,
        minZoom: 0.6,
        maxZoom: 12,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;
    setReady(false);
    if (import.meta.env.DEV) (window as any).__ifeMap = map;

    map.on("error", () => setFailed(true));
    map.on("load", () => {
      const empty = { type: "FeatureCollection", features: [] } as const;
      for (const id of [NIGHT, TERMINATOR, AHEAD, FLOWN_UNHEARD, FLOWN_HEARD]) {
        map.addSource(id, { type: "geojson", data: empty as any });
      }

      // Night, over the ground and under the names. Every seat-back map has
      // this line, and it is the only thing on one that is not about the
      // aircraft: it is why the shade beside you is down.
      map.addLayer({
        id: NIGHT,
        type: "fill",
        source: NIGHT,
        paint: {
          "fill-color": "#02040a",
          "fill-antialias": false,
          // Night is heaviest seen from space and lifts as you come down to
          // it, which is both what it looks like out of a window — the ground
          // at night is dark, not black — and what keeps the names and the
          // relief readable in the forward view.
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2,
            0.62,
            6,
            0.46,
            9,
            0.3,
          ],
        },
      });
      map.addLayer({
        id: TERMINATOR,
        type: "line",
        source: TERMINATOR,
        paint: {
          "line-color": "#6aadcc",
          "line-width": 1.4,
          "line-opacity": 0.34,
        },
      });

      map.addLayer({
        id: "places",
        type: "raster",
        source: "places",
        paint: { "raster-opacity": 0.92 },
      });

      // Route still to fly: dashed and dim. It has not happened, so under the
      // evidence rule it cannot be drawn solid.
      map.addLayer({
        id: AHEAD,
        type: "line",
        source: AHEAD,
        paint: {
          "line-color": "#cfd6de",
          "line-width": 2,
          "line-dasharray": [2, 3],
          "line-opacity": 0.8,
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
          "line-width": 2.6,
          "line-dasharray": [1.6, 2.2],
        },
      });
      // Flown and heard: solid. The only solid line on the map.
      map.addLayer({
        id: FLOWN_HEARD,
        type: "line",
        source: FLOWN_HEARD,
        paint: { "line-color": "#f6f3ec", "line-width": 3.2 },
      });
      setReady(true);
    });

    // A finger on the map takes the camera. MapLibre's own eased moves carry
    // no originalEvent, which is exactly how a gesture is told apart from the
    // buttons calling fitBounds.
    const seize = (e: any) => {
      if (e?.originalEvent) setView("free");
    };
    map.on("dragstart", seize);
    map.on("zoomstart", seize);
    map.on("rotatestart", seize);
    map.on("pitchstart", seize);

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
      new LngLatBounds(
        line[0] as [number, number],
        line[0] as [number, number],
      ),
    );
    // Room for the readout along the bottom and for the control column on the
    // right — the padding has to hold the destination's dot *and* the name
    // hanging off it, or the label slides under the buttons.
    map.fitBounds(bounds, {
      padding: { top: 150, bottom: 230, left: 170, right: 400 },
      bearing: 0,
      pitch: 0,
      duration: 900,
    });
  }, [route.from, route.to]);

  /**
   * Terrain costs tiles and it only earns them in the forward view, where the
   * ground has to have shape. Everywhere else it is a flat globe, which is
   * also what the reference cabin shows.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (view === "forward") {
      if (!map.getTerrain())
        map.setTerrain({ source: "dem", exaggeration: 1.3 });
    } else if (map.getTerrain()) {
      map.setTerrain(null);
    }
  }, [view, ready]);

  // Whichever view is in force, applied when it changes and when the thing it
  // follows moves. "free" is the passenger's, and nothing touches it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (view === "route") fitRoute();
    if (view === "globe") {
      // Not a flat disc of a planet in the middle of the frame: the camera
      // stands off and looks down at it, so the limb curves across the top
      // and there is space above it. That is the shot every cabin globe uses,
      // and it is the difference between a planet and a circle with a map in
      // it.
      map.easeTo({
        center: [position.lon, position.lat],
        zoom: 2.4,
        pitch: 34,
        bearing: 0,
        offset: [0, 90],
        duration: 1200,
      });
    }
    if (view === "aircraft") {
      map.easeTo({
        center: [position.lon, position.lat],
        zoom: Math.max(map.getZoom(), 5),
        pitch: 0,
        bearing: 0,
        // The aircraft sits low in the frame, because what a passenger wants
        // from this view is what is coming.
        offset: [0, 150],
        duration: 700,
      });
    }
    if (view === "forward") {
      // Standing at the aircraft, looking where it is pointed. The pitch is
      // what makes this the view it is: the horizon has to be in the frame,
      // and the country between here and it has to be readable.
      map.easeTo({
        center: [position.lon, position.lat],
        zoom: 6.4,
        pitch: 74,
        bearing: position.headingDeg,
        offset: [0, 210],
        duration: 900,
      });
    }
  }, [view, ready, fitRoute, position.lat, position.lon, position.headingDeg]);

  // Night, recomputed on the minute. The sun moves 0.25° of longitude in that
  // time, which is about a pixel at this zoom.
  useEffect(() => {
    if (!ready) return;
    const paint = () => {
      const at = new Date();
      (mapRef.current?.getSource(NIGHT) as any)?.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: [nightRing(at)] },
          },
        ],
      });
      (mapRef.current?.getSource(TERMINATOR) as any)?.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: terminatorLine(at),
            },
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

  const forward = view === "forward";
  const toDest = bearing(position, route.to);

  return (
    <div className="ife-map" data-view={view}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      {failed && (
        <div className="ife-map-fail">
          <div className="ife-title">{t("mapUnavailable")}</div>
          <div style={{ marginTop: 18 }}>{t("mapUnavailableBody")}</div>
        </div>
      )}

      {/* The forward view is an instrument panel, as it is in the cabin this
          is drawn from. It replaces the figures rather than joining them. */}
      {forward && <Instruments position={position} bearingToDest={toDest} />}

      {/* On-glass controls rather than MapLibre's own: theirs ship a compass
          nobody can use, at a size made for a mouse. */}
      <div className="ife-mapctl">
        <button
          className="ife-mapbtn"
          aria-label={t("zoomIn")}
          onClick={zoom(1)}
        >
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
          aria-label={t("viewGlobe")}
          data-on={view === "globe"}
          onClick={() => setView("globe")}
        >
          <IconPlanet size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("wholeRoute")}
          data-on={view === "route"}
          onClick={() => setView("route")}
        >
          <IconRoute size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("followAircraft")}
          data-on={view === "aircraft"}
          onClick={() => setView("aircraft")}
        >
          <IconTarget size={36} />
        </button>
        <button
          className="ife-mapbtn"
          aria-label={t("viewForward")}
          data-on={forward}
          onClick={() => setView("forward")}
        >
          <IconForward size={36} />
        </button>
      </div>

      {!forward && (
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
      )}
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
      <div
        className={`ife-figure-value ife-mono${inferred ? " ife-inferred" : ""}`}
      >
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
