import { useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFlight } from "../../flight-state/store";
import { arc } from "../../flight-state/geo";
import { fmtInt } from "../format";

/**
 * Basemap: Esri's World Dark Gray Base, as raster tiles.
 *
 * Chosen because it needs no API key and because the sky view already runs on
 * it — CARTO stamps "API KEY REQUIRED" across every keyless tile, and a
 * moving map is not the place to take a second unproven tile host as a
 * dependency. The limits are real and worth stating: it is a courtesy service
 * with no SLA, it is raster so the labels cannot be restyled or translated,
 * and the attribution below the map is required, not decorative.
 */
const BASEMAP =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

const FLOWN_HEARD = "flown-heard";
const FLOWN_UNHEARD = "flown-unheard";
const AHEAD = "ahead";

export function MapScreen() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [failed, setFailed] = useState(false);
  // The style's load event fires once and may already have fired by the time
  // the data effect runs, so readiness is state rather than a listener.
  const [ready, setReady] = useState(false);
  const { route, position, track } = useFlight();

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
              tiles: [BASEMAP],
              tileSize: 256,
              maxzoom: 16,
              attribution:
                "Esri, HERE, Garmin, © OpenStreetMap contributors",
            },
          },
          layers: [
            { id: "bg", type: "background", paint: { "background-color": "#070a0f" } },
            { id: "base", type: "raster", source: "base", paint: { "raster-opacity": 0.5 } },
          ],
        },
        center: [route.from.lon, route.from.lat],
        zoom: 2,
        attributionControl: { compact: true },
        // A seat-back screen is not dragged around by the passenger in this
        // build; the map's job is to show the flight, not to be explored.
        interactive: false,
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
      for (const id of [AHEAD, FLOWN_UNHEARD, FLOWN_HEARD]) {
        map.addSource(id, { type: "geojson", data: empty as any });
      }
      // Route still to fly: dashed and dim. It has not happened, so under the
      // evidence rule it cannot be drawn solid.
      map.addLayer({
        id: AHEAD,
        type: "line",
        source: AHEAD,
        paint: {
          "line-color": "#8794a2",
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
          "line-color": "#e8a33d",
          "line-width": 2.5,
          "line-dasharray": [1.6, 2.2],
        },
      });
      // Flown and heard: solid. The only solid line on the map.
      map.addLayer({
        id: FLOWN_HEARD,
        type: "line",
        source: FLOWN_HEARD,
        paint: { "line-color": "#e8ebef", "line-width": 3 },
      });
      setReady(true);
    });

    const el = document.createElement("div");
    el.className = "ife-plane-marker";
    el.innerHTML = PLANE_SVG;
    markerRef.current = new Marker({ element: el, rotationAlignment: "map" })
      .setLngLat([route.from.lon, route.from.lat])
      .addTo(map);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [route.from.iata, route.to.iata]);

  // Route geometry and camera. Re-fit only when the route itself changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const fit = () => {
      const line = arc(route.from, route.to);
      const bounds = line.reduce(
        (b, c) => b.extend(c as [number, number]),
        new LngLatBounds(
          line[0] as [number, number],
          line[0] as [number, number],
        ),
      );
      map.fitBounds(bounds, { padding: 180, duration: 0 });
    };
    if (ready) fit();
  }, [ready, route.from.iata, route.to.iata]);

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
            geometry: { type: "LineString", coordinates: arc(position, route.to) },
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

  return (
    <div className="ife-map">
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      {failed && (
        <div className="ife-map-fail">
          <div className="ife-title">Map unavailable</div>
          <div style={{ marginTop: 18 }}>
            The basemap did not load. The flight is still being tracked; only
            the ground under it is missing.
          </div>
        </div>
      )}
      <div className="ife-map-readout">
        <Readout label="Altitude" value={fmtInt(position.altFt)} unit="ft" inferred={!position.heard} />
        <Readout label="Ground speed" value={fmtInt(position.gsKt)} unit="kt" inferred={!position.heard} />
        <Readout
          label="Heading"
          value={`${Math.round(position.headingDeg).toString().padStart(3, "0")}°`}
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
const PLANE_SVG = `<svg width="34" height="34" viewBox="0 0 24 24" style="display:block">
  <path d="M12 2.5 13.6 10 22 13.4v1.9l-8.4-2.3-.5 4.9 3 2.2v1.4L12 20.3l-4.1 1.2v-1.4l3-2.2-.5-4.9L2 15.3v-1.9L10.4 10z"/>
</svg>`;
