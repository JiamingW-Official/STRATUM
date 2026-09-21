/**
 * The aircraft on the moving map, drawn from the sky view's own model.
 *
 * The map used to carry a hand-drawn airliner. This is the real thing: the
 * same GLB the sky view flies overhead, rendered once with three.js from
 * directly above, in white, and handed back as a canvas.
 *
 * Rendered once, not every frame, and that is not a shortcut — it is the
 * geometry of the problem. The three views that show the aircraft are all
 * north-up and unpitched, so an aeroplane seen from directly above is the
 * same picture at every heading; only its rotation changes, and a CSS
 * transform does rotation for free. The three views where the camera is
 * pitched are the window views, and those do not draw the aircraft at all,
 * because you are sitting in it.
 *
 * That also sidesteps the real difficulty with putting three.js inside
 * MapLibre: a custom layer has to build its own model-view-projection matrix,
 * and under globe projection the world space is a sphere rather than the
 * mercator cube every recipe on the internet assumes. A DOM marker is placed
 * by MapLibre itself and is right on both.
 */
import MODEL from "../../models/Airplane_Model_B777.glb?url";
const SIZE = 256;

let pending: Promise<HTMLCanvasElement | null> | null = null;

export function planeSprite(): Promise<HTMLCanvasElement | null> {
  pending ??= render().catch(() => null);
  return pending;
}

async function render(): Promise<HTMLCanvasElement | null> {
  const THREE = await import("three");
  // The decoder is not optional: these GLBs are meshopt-compressed and carry
  // EXT_meshopt_compression in extensionsRequired, so a bare loader has nothing
  // to fall back on and this marker would come back empty.
  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import("three/addons/loaders/GLTFLoader.js"),
    import("three/addons/libs/meshopt_decoder.module.js"),
  ]);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL);
  const model = gltf.scene;

  // White, and only white: the sky view's models carry liveries, and a livery
  // at 54 pixels is noise. Matte rather than metal — a metallic fuselage with
  // no environment to reflect renders as a dark smear.
  model.traverse((child: any) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: 0xf4f1ea,
        metalness: 0.05,
        roughness: 0.62,
      });
    }
  });

  // Point the nose at screen-up and lay the aircraft flat, then frame it on
  // its own bounding box so the model's own scale and origin do not matter.
  const scene = new THREE.Scene();
  scene.add(model);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  model.position.sub(centre);
  const span = Math.max(size.x, size.z) * 1.06;

  const camera = new THREE.OrthographicCamera(
    -span / 2,
    span / 2,
    span / 2,
    -span / 2,
    0.01,
    span * 20,
  );
  // Looking straight down, with the model's nose toward the top of the frame.
  // The first pass set `up` to -Z and the aeroplane came out flying backwards
  // down its own track: this model's nose is +Z, and `up` is which way is up
  // on the screen, not which way the aircraft points.
  camera.position.set(0, span * 4, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  // One light high and to the left, one fill, and nothing else: the marker
  // carries its own shadow in CSS, in screen space, so the light in here only
  // has to give the fuselage a top and the wings a side.
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-1.2, 2.4, -0.8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fb8cc, 0.5);
  rim.position.set(1.4, 0.6, 1.2);
  scene.add(rim);

  const canvas = document.createElement("canvas");
  const dpr = Math.min(3, globalThis.devicePixelRatio || 1);
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearAlpha(0);
  renderer.render(scene, camera);
  // The context has done its one job. Keeping it alive would hold a WebGL
  // context open for the whole flight to show a picture that never changes.
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  out.getContext("2d")!.drawImage(canvas, 0, 0);
  out.style.width = `${SIZE}px`;
  out.style.height = `${SIZE}px`;
  renderer.dispose();
  return out;
}
