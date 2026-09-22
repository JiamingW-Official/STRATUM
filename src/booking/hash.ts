/**
 * FNV-1a, once, on its own.
 *
 * It lived in schedule.ts, and the seat map and the member card both reached
 * into the timetable for it — which put the timetable and the seat map in a
 * ring once the timetable needed to ask the seat map whether an aircraft has
 * a nose. A ring of imports evaluates in whatever order the first importer
 * happens to fix, and a hash function has no business deciding that.
 */
/** FNV-1a. Small, stable, and the same number on every machine. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
