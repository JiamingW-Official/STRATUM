/**
 * three.js, untyped on purpose.
 *
 * The package at 0.183 does not expose its declarations through its exports
 * map, and `@types/three` is a separately versioned package that has to be
 * kept in step with the runtime by hand. The sky view is JavaScript and never
 * needed either. Exactly one file in the typed half of this project touches
 * three — the aircraft sprite — so the cheaper honest answer is to say that
 * these two modules are untyped and leave the dependency list alone.
 */
declare module "three";
declare module "three/addons/loaders/GLTFLoader.js";
