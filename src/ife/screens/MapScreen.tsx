import { useCallback, useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useFlight } from "../../flight-state/store";
import type { FlightPosition } from "../../flight-state/types";
import { alongBearing, arc, bearing, greatCircleKm } from "../../flight-state/geo";
import { duration, fmtInt, localTime } from "../format";
import { pick, useT } from "../i18n";
import { nightRing, terminatorLine } from "../sun";
// @ts-expect-error — shared Vanilla JS data, read by the sky view too.
import { CITIES } from "../../data/cities.js";
import { Instruments } from "../chrome/Instruments";
import { planeSprite } from "../chrome/planeSprite";
import { IconChevron } from "../chrome/icons";

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
 *
 * There is no elevation layer, and that is a measurement rather than an
 * omission. The window views carried terrarium DEM tiles so the ground would
 * have shape, and at 85 degrees of pitch — which is what looking at the
 * horizon costs — the terrain system has to build a mesh for everything out
 * to 379km. Measured in the forward view: 30ms a frame, a 95th percentile of
 * 296ms and 48 long tasks in eight seconds, against 17ms flat and two long
 * tasks with it off. The same camera at 70 degrees was fine, which is the
 * tell: it is the area, not the tiles.
 *
 * It was also buying very little. From eleven kilometres up the ground is a
 * photograph, and the shape you can see out of a window at that height is
 * the curve of the earth — which comes from the globe projection. Six frames
 * a second to model a hill nobody can see is the wrong trade.
 */
const IMAGERY =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const PLACES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

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
type View =
  | "globe"
  | "route"
  | "aircraft"
  | "forward"
  | "left"
  | "right"
  | "free";

/** The three that stand at the aircraft and look out of it. */
const WINDOW: View[] = ["forward", "left", "right"];

/** How often a new position arrives. The follow move is exactly this long. */
const TICK_MS = 500;

export function MapScreen({
  /**
   * Called once, after the map has drawn a complete frame.
   *
   * The map is built and holding its tiles long before anybody presses
   * Flight map, but a canvas nobody can see does not get drawn — and the
   * first real draw is shader compilation and texture upload, which
   * measured 3.4 seconds of frozen main thread starting 43ms after the
   * press. So the container keeps it painted-but-invisible until this
   * fires, and only then puts it away properly.
   */
  onFirstRender,
}: {
  onFirstRender?: () => void;
} = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const apRef = useRef<Marker[]>([]);
  const cityRef = useRef<Marker[]>([]);
  // The position the marker's aim reads, and the aim itself: both live
  // outside React because they are wanted inside MapLibre's move handler.
  const posRef = useRef<FlightPosition | null>(null);
  const aimRef = useRef<(() => void) | null>(null);
  // Where the earth stops, in pixels down the map, measured off the camera
  // rather than worked out from a formula.
  const [horizonY, setHorizonY] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  // The style's load event fires once and may already have fired by the time
  // the data effect runs, so readiness is state rather than a listener.
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("route");
  // Which view the last camera move was for, so following can be told apart
  // from arriving.
  const lastView = useRef<View>("route");
  // The view menu is a sidebar, and a sidebar is shut until it is asked for:
  // six view names permanently parked over the right third of a map is six
  // words in front of the thing you came to look at.
  const [menu, setMenu] = useState(false);
  const { route, position, track, etaUtc, etaInferred, departureUtc } =
    useFlight();
  posRef.current = position;
  const remaining = Date.parse(etaUtc) - Date.now();
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
        // No cross-fade. MapLibre's default 300ms fade is what reads as
        // "the map is buffering" — a tile that has arrived is a tile, and
        // dissolving it in makes a loaded map look like a loading one.
        fadeDuration: 0,
        // Room to hold the whole flight. The default is a few screens' worth,
        // so switching from the globe to the route and back re-fetched tiles
        // that had been on the glass ten seconds earlier.
        maxTileCacheSize: 800,
        // The passenger's map. Rotation and pitch are on, because the views
        // that need them are the point; the bearing is still always the
        // system's in the three level views, which are north-up.
        interactive: true,
        minZoom: 0.6,
        maxZoom: 14,
        // 85 is the flattest MapLibre allows, and the window views need it:
        // from eleven kilometres up, a camera any more upright than that is
        // looking at the ground rather than at the horizon.
        maxPitch: 85,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;
    setReady(false);
    if (import.meta.env.DEV) (window as any).__ifeMap = map;

    map.on("error", () => setFailed(true));
    map.once("idle", () => onFirstRender?.());
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
    // The drawn airliner is what is on the glass until the model arrives, and
    // what stays there if it never does.
    el.innerHTML = PLANE_SVG;
    planeSprite().then((sprite) => {
      if (!sprite || !el.isConnected) return;
      sprite.className = "ife-plane-model";
      el.replaceChildren(sprite);
      el.dataset.model = "true";
    });
    /**
     * Pointed where it is going, on a sphere.
     *
     * `rotationAlignment: "map"` is not enough here, and this is the second
     * time it has looked like it was doing nothing. MapLibre's marker
     * rotation is flat-map arithmetic: it draws `rotation - bearing` in
     * screen space. On a globe that is only right at the point the camera is
     * looking at — everywhere else the sphere has turned the local north
     * away from the top of the screen, by more the further round the limb
     * you are. Over Newfoundland, a 65° heading drawn as 65° from screen-up
     * points somewhere else entirely.
     *
     * So the heading is converted to a screen angle before it is handed
     * over: project the aircraft, project a point 40km along its heading,
     * and the angle between the two pixels is the direction of travel *as
     * drawn*, with the projection's own distortion already in it. That makes
     * the alignment `viewport`, because by then the number is a screen
     * angle; pitch alignment stays on the map so the aeroplane still lies
     * down on the ground when the camera tilts.
     */
    markerRef.current = new Marker({
      element: el,
      rotationAlignment: "viewport",
      pitchAlignment: "map",
    })
      .setRotation(0)
      .setLngLat([route.from.lon, route.from.lat])
      .addTo(map);

    /**
     * And it is the size it should be for how far away you are.
     *
     * One size for every zoom meant an aircraft the size of Ireland on the
     * globe. It is small when the whole planet is in frame and grows as you
     * come down to it — the same thing distance does.
     */
    const scaleToZoom = () => {
      const z = map.getZoom();
      const k = z <= 3 ? 0.42 : z >= 8 ? 1 : 0.42 + ((z - 3) / 5) * 0.58;
      el.style.setProperty("--planeScale", k.toFixed(3));
    };
    scaleToZoom();
    map.on("zoom", scaleToZoom);

    // The screen angle changes when the camera turns, not only when the
    // aircraft does, so it is recomputed on move rather than on position.
    const aim = () => {
      const m = markerRef.current;
      const p = posRef.current;
      if (!m || !p) return;
      const here = map.project([p.lon, p.lat]);
      const ahead = alongBearing(p, p.headingDeg, 40);
      const there = map.project([ahead.lon, ahead.lat]);
      const dx = there.x - here.x;
      const dy = there.y - here.y;
      if (dx * dx + dy * dy < 1) return;
      m.setRotation((Math.atan2(dx, -dy) * 180) / Math.PI);
    };
    aimRef.current = aim;
    map.on("move", aim);
    map.on("zoom", aim);

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
      for (const m of cityRef.current) m.remove();
      cityRef.current = [];
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

  /**
   * The names of the places you are looking at, standing up.
   *
   * The ground labels come from Esri's Boundaries and Places, which is a
   * raster: the names are painted into the tile, so they lie flat on the
   * earth. Looking down that is what you want and looking *along* it they are
   * a smear of foreshortened type on the horizon — a name lying on its face
   * 300km away is not a name. So the window views get their own, as DOM
   * markers, which stand upright facing the camera the way the label on a
   * real moving map does. The airports at either end have always worked this
   * way; these are the 633 places the sky view names, now in src/data where
   * both views can reach them.
   *
   * Only what you could actually see: inside the true horizon for the
   * altitude, and inside the arc the window looks along. MapLibre hides a
   * marker the planet has come between, so a city over the edge of the world
   * goes away by itself.
   */
  /**
   * Rounded, all four of them.
   *
   * Latitude and longitude were rounded to half a degree so this list would
   * not be rebuilt for every fix; heading and altitude were not, and both of
   * them are floats that move on every tick — so the guard was doing nothing
   * and ten DOM markers were destroyed and made again twice a second. The
   * labels you are looking at do not change when the aircraft turns a
   * quarter of a degree, and a name that is torn down and put back is a name
   * that flickers.
   */
  const near = Math.round(position.lat * 2) / 2;
  const nearLon = Math.round(position.lon * 2) / 2;
  const nearHeading = Math.round(position.headingDeg / 2) * 2;
  const nearAlt = Math.round(position.altFt / 500) * 500;
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const m of cityRef.current) m.remove();
    cityRef.current = [];
    if (!WINDOW.includes(view)) return;

    // The geometric horizon: sqrt(2Rh), in kilometres, for the altitude we
    // are given. At 37,000 ft that is 379 km, which is why the forward view
    // looks like the window and a guessed zoom did not.
    const altM = Math.max(1, nearAlt * 0.3048);
    const horizonKm = Math.sqrt(2 * 6371 * (altM / 1000));
    const look =
      (nearHeading + (view === "left" ? -90 : view === "right" ? 90 : 0) + 360) % 360;

    const shown = (CITIES as Array<{ name: string; code: string; lat: number; lon: number }>)
      .map((c) => ({
        c,
        d: greatCircleKm(position, { lat: c.lat, lon: c.lon }),
        b: bearing(position, { lat: c.lat, lon: c.lon }),
      }))
      .filter((x) => x.d < horizonKm && Math.abs(((x.b - look + 540) % 360) - 180) < 68)
      .sort((a, b) => a.d - b.d)
      .slice(0, 10);

    cityRef.current = shown.map(({ c }) => {
      const node = document.createElement("div");
      node.className = "ife-city-marker";
      node.innerHTML =
        `<span class="ife-city-name"></span><span class="ife-city-stalk"></span>`;
      node.querySelector(".ife-city-name")!.textContent = c.name;
      // Anchored at its dot, which is on the left of the name — the same
      // anchoring the airport markers use, and what the reference does.
      return new Marker({ element: node, anchor: "left" })
        .setLngLat([c.lon, c.lat])
        .addTo(map);
    });
  }, [view, ready, near, nearLon, nearHeading, nearAlt]);

  /**
   * Where the earth stops.
   *
   * Not computed from a formula — asked, with public API only. Unproject a
   * point on the glass and project the result back: below the horizon it
   * lands where it started, and above it the ray never meets the planet, so
   * it does not. Twenty steps of bisection between the top of the map and its
   * bottom find the line to within a pixel. A formula would have to know
   * MapLibre's field of view, how pitch warps it and what terrain does to it;
   * this knows none of those and is right anyway — measured at 338.6 of 872
   * on a 85° pitch at 19,800 ft, which is where the picture's own horizon is.
   *
   * It fires on render, and render is every frame, so it only tells React
   * when the answer has actually moved a pixel. A setState per frame is the
   * other way to make a map judder.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !WINDOW.includes(view)) {
      setHorizonY(null);
      return;
    }
    let last = -1;
    const onSurface = (y: number) => {
      try {
        const back = map.project(map.unproject([map.getCanvas().clientWidth / 2, y]));
        return Math.abs(back.y - y) < 1.5;
      } catch {
        return false;
      }
    };
    const find = () => {
      const h = map.getCanvas().clientHeight;
      // The whole picture is sky: nothing to draw a line on.
      if (!onSurface(h - 1)) {
        if (last !== -2) {
          last = -2;
          setHorizonY(null);
        }
        return;
      }
      let lo = 0;
      let hi = h - 1;
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        if (onSurface(mid)) hi = mid;
        else lo = mid;
      }
      const y = Math.round(hi);
      if (y === last || y < 3 || y > h - 3) return;
      last = y;
      setHorizonY(y);
    };
    /**
     * Once a frame at most, and only when the camera has actually moved.
     *
     * This used to run on every render event, and every run is twenty
     * unproject/project round trips: measured, the forward view was drawing
     * a frame every 161ms with 44 long tasks in eight seconds. The line it
     * finds cannot move unless the camera does, and when the camera does
     * move one answer per frame is all a line can use.
     */
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        find();
      });
    };
    find();
    map.on("move", schedule);
    map.on("moveend", schedule);
    return () => {
      map.off("move", schedule);
      map.off("moveend", schedule);
    };
  }, [view, ready]);

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
    // The room the chrome actually takes now. It used to reserve 400px on the
    // right for a control column that has been a drawer for a while, and
    // 230 at the bottom for a two-line figure strip that is one line — so
    // the flight was squeezed into the left two thirds of the glass.
    map.fitBounds(bounds, {
      padding: { top: 120, bottom: 150, left: 150, right: 190 },
      bearing: 0,
      pitch: 0,
      duration: 900,
    });
  }, [route.from, route.to]);

  /**
   * A window does not pan.
   *
   * Forward, left and right are not a map you are looking at, they are a
   * window you are looking out of — the camera is at the aircraft, at the
   * aircraft's height, pointed where the aircraft is pointed. Dragging it
   * puts you somewhere the seat is not, and worse, a drag sets the view to
   * "free", so one accidental swipe and the window was gone.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const locked = WINDOW.includes(view);
    for (const h of [
      map.dragPan,
      map.dragRotate,
      map.scrollZoom,
      map.touchZoomRotate,
      map.doubleClickZoom,
      map.keyboard,
    ])
      locked ? h.disable() : h.enable();
  }, [view]);

  /**
   * Whichever view is in force, applied when it changes and when the thing it
   * follows moves. "free" is the passenger's, and nothing touches it.
   *
   * Two different moves, and that is the whole of why this used to judder.
   * Changing view is a journey and gets an eased one. Following is not: the
   * position arrives every 500ms, and a 900ms eased move restarted every
   * 500ms never reaches its target and never stops accelerating out of its
   * own easing curve — the camera lurched twice a second. A linear move
   * exactly as long as the gap between fixes ends as the next one begins, so
   * the motion is continuous and has no curve to lurch out of.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const moved = lastView.current === view;
    lastView.current = view;
    const chase = moved
      ? { duration: TICK_MS, easing: (t: number) => t }
      : undefined;
    // Only when you arrive at it. The whole route is two airports and a
    // great circle between them; none of that changes when the aircraft
    // moves, so re-fitting the bounds on every position fix was a 900ms
    // camera animation restarted twice a second for no new information.
    if (view === "route" && !moved) fitRoute();
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
        ...chase,
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
        ...chase,
      });
    }
    if (WINDOW.includes(view)) {
      /**
       * Standing at the aircraft, at the height the aircraft is actually at.
       *
       * The first version of this picked a zoom that looked about right, which
       * is a drawing of a view rather than the view. MapLibre can put the
       * camera at a real altitude instead, so it does: 37,000 ft is 11,278 m,
       * and from 11,278 m the horizon is 379 km away — which is why this looks
       * like the window and the guessed zoom did not.
       *
       * Left and right are the same camera turned a quarter turn, because that
       * is what they are: the window on that side.
       */
      const altM = Math.max(250, position.altFt * 0.3048);
      const turn = view === "left" ? -90 : view === "right" ? 90 : 0;
      const opts = map.calculateCameraOptionsFromCameraLngLatAltRotation(
        [position.lon, position.lat],
        altM,
        (position.headingDeg + turn + 360) % 360,
        // Forward looks at the horizon; a side window looks down at what you
        // are passing over, which is what anybody in a window seat is doing.
        view === "forward" ? 85 : 76,
      );
      map.easeTo({ ...opts, duration: 900, ...chase });
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
    if (el) el.dataset.heard = String(position.heard);
    markerRef.current?.setLngLat([position.lon, position.lat]);
    aimRef.current?.();
  }, [ready, track, position, route.to.iata]);

  const window_ = WINDOW.includes(view);
  const toDest = bearing(position, route.to);

  // The strip's contents, as a list rather than as markup, because the
  // ticker prints them twice.
  const facts: Array<{ label: string; value: string; inferred?: boolean }> = [
    { label: t("altitude"), value: `${fmtInt(position.altFt)} ft`, inferred: !position.heard },
    { label: t("groundSpeed"), value: `${fmtInt(position.gsKt)} kt`, inferred: !position.heard },
    {
      label: t("heading"),
      value: `${Math.round(position.headingDeg).toString().padStart(3, "0")}°`,
      inferred: !position.heard,
    },
    {
      label: t("distanceToGo"),
      value: `${fmtInt(greatCircleKm(position, route.to))} km`,
      inferred: !position.heard,
    },
    {
      label: t("distanceFlown"),
      value: `${fmtInt(greatCircleKm(route.from, position))} km`,
      inferred: !position.heard,
    },
    { label: t("timeRemaining"), value: duration(remaining, lang), inferred: etaInferred },
    { label: t("elapsedSoFar"), value: duration(Date.now() - Date.parse(departureUtc), lang) },
    {
      label: `${t("localTime")} ${route.to.iata}`,
      value: localTime(new Date().toISOString(), route.to),
    },
    {
      label: `${t("localTime")} ${route.from.iata}`,
      value: localTime(new Date().toISOString(), route.from),
    },
    {
      label: t("arrival"),
      value: `${localTime(etaUtc, route.to)} ${route.to.iata}`,
      inferred: etaInferred,
    },
  ];

  return (
    <div className="ife-map" data-view={view} data-side={menu}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }} />
      {failed && (
        <div className="ife-map-fail">
          <div className="ife-title">{t("mapUnavailable")}</div>
          <div style={{ marginTop: 18 }}>{t("mapUnavailableBody")}</div>
        </div>
      )}

      {/* The instrument panel belongs to the forward view and to nothing
          else. Forward is the cockpit's view and the tapes are what a
          cockpit has; a left or right window is a window — you look out of
          it at what you are passing over, and a speed tape across it is an
          instrument standing between you and the ground. The side windows
          keep the figure strip instead, which is what every other view on
          this map has along the bottom. */}
      {view === "forward" && (
        <Instruments
          position={position}
          bearingToDest={toDest}
          horizonY={horizonY}
        />
      )}

      {/* The view menu, as a sidebar that comes in from the right.
 
          It was a floating panel parked over the map. Six view names sitting
          permanently over the right third of the picture is six words in front
          of the thing you came to look at — so it is shut until it is asked
          for, and the handle stays on the edge where a hand already is.
 
          Written out rather than drawn: left and right have no icon anybody
          would recognise, because a left-pointing arrow on a map means "pan
          left". */}
      <div className="ife-mapside" data-open={menu}>
        <button
          className="ife-mapside-handle"
          aria-expanded={menu}
          aria-label={t("views")}
          onClick={() => setMenu(!menu)}
        >
          <IconChevron size={34} flip={menu} />
        </button>

        <div className="ife-mapside-panel">
          <div className="ife-mapside-head ife-cap">{t("views")}</div>
          {(
            [
              ["globe", "viewGlobe"],
              ["route", "wholeRoute"],
              ["aircraft", "followAircraft"],
              ["forward", "viewForward"],
              ["left", "viewLeft"],
              ["right", "viewRight"],
            ] as const
          ).map(([v, key]) => (
            <button
              key={v}
              className="ife-mapview"
              data-on={view === v}
              onClick={() => setView(v)}
            >
              {t(key)}
            </button>
          ))}

        </div>
      </div>

      {/* Everything the flight knows about itself, running along the bottom.
 
          It was a row you pushed sideways with a thumb, two lines to a fact,
          and it held six of ten before the edge cut it — so four of the
          things the flight knows were behind a gesture nobody was told
          about. Now it reads itself out: one line to a fact, label and
          figure side by side, going past at 60 pixels a second. The list is
          rendered twice and the track slides exactly half its width, which
          is how a loop is made to have no seam.
 
          A CSS animation, not a scroll position stepped in JavaScript: this
          runs on the compositor, so it does not stutter when the map is busy
          with tiles and it does not cost a frame of the main thread. */}
      {view !== "forward" && (
        <div className="ife-map-strip">
          <div className="ife-map-ticker">
            {[0, 1].map((copy) => (
              <div
                className="ife-map-ticker-run"
                key={copy}
                aria-hidden={copy === 1}
              >
                {facts.map((f) => (
                  <Fact key={f.label} {...f} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** One figure on the strip, and whether it rests on something heard. */
function Fact({
  label,
  value,
  inferred,
}: {
  label: string;
  value: string;
  inferred?: boolean;
}) {
  return (
    <div className="ife-fact">
      <span className="ife-cap">{label}</span>
      <span className={`ife-fact-value ife-mono${inferred ? " ife-inferred" : ""}`}>
        {value}
      </span>
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

/**
 * The aircraft, lit.
 *
 * It was the same flat silhouette the journey strip uses, which is right at
 * strip size and thin at map size. This one is an airliner from above with the
 * shape an airliner has — swept wings, two engines under them, a tailplane —
 * and it is shaded: a highlight down the spine of the fuselage, the wings
 * darker than the body, and a shadow under the whole thing.
 *
 * The shadow is on the marker's container rather than inside the drawing, so
 * it stays where it is while the aircraft turns. A shadow that rotates with
 * the aeroplane is a sticker; a shadow that stays put is a light.
 *
 * Filled when a receiver has it, hollow and broken when the position is our
 * belief rather than its report — the same rule as everywhere else.
 */
const PLANE_SVG = `<svg width="54" height="54" viewBox="0 0 64 64" style="display:block">
  <defs>
    <linearGradient id="fuse" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b9b6ae"/>
      <stop offset="0.42" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#8e8b84"/>
    </linearGradient>
    <linearGradient id="wing" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d8d5cd"/>
      <stop offset="1" stop-color="#7e7b75"/>
    </linearGradient>
  </defs>
  <g class="plane-body">
    <path class="plane-wing" d="M32 26c1.1 0 1.8.7 2 1.9l.6 5.1 22 12.6v3.4l-22-5.6v1.2l-2 .6-2-.6v-1.2l-22 5.6v-3.4l22-12.6.6-5.1c.2-1.2.9-1.9 2-1.9z"/>
    <path class="plane-tail" d="M32 48.5c.8 0 1.3.5 1.5 1.4l.5 3.6 8 4.6v2.4l-8-2v1.3l-2 .8-2-.8v-1.3l-8 2v-2.4l8-4.6.5-3.6c.2-.9.7-1.4 1.5-1.4z"/>
    <path class="plane-fuse" d="M32 3.5c2.4 0 4 2.6 4.3 6.3l1.4 18.6c.3 4.2.5 9.6.5 14.4 0 6.6-.4 12.4-1 15.6-.5 2.6-1.4 4.1-2.6 4.6l-2.6 1-2.6-1c-1.2-.5-2.1-2-2.6-4.6-.6-3.2-1-9-1-15.6 0-4.8.2-10.2.5-14.4l1.4-18.6C28 6.1 29.6 3.5 32 3.5z"/>
    <path class="plane-nacelle" d="M18.5 33.5h4.6l-1 9h-2.6zM45.5 33.5h-4.6l1 9h2.6z"/>
  </g>
</svg>`;
