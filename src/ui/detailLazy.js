/* The dossier is the largest thing in the boot path and the last thing anyone
   needs: 136KB of source that does nothing until an aircraft is clicked. It
   was static, so it parsed before the first frame of a map nobody had touched
   yet.
 
   This stands in for it. Every call either goes straight through, if the real
   module has arrived, or is recorded and replayed in order when it does. That
   matters because three of the calls happen during boot -- onNamed registers a
   callback, startDetailRotor starts the rotor, setCommonsPlace names the place
   -- and dropping them would be a silent, much worse bug than a slow load.
 
   getSelectedAircraft is the one that cannot wait, because it is read inside
   the filter pass. It answers null until the module is here, which is not a
   guess: selection only happens through showDetail, so before this module
   loads there is nothing selected to report. */
let _m = null;
let _loading = null;
const _queue = [];

function _load() {
  if (_loading) return _loading;
  _loading = import("./detail.js").then((m) => {
    _m = m;
    for (const [name, args] of _queue) m[name](...args);
    _queue.length = 0;
    return m;
  });
  return _loading;
}

function _call(name, args) {
  if (_m) return _m[name](...args);
  _queue.push([name, args]);
  _load();
  return undefined;
}

/* Off the critical path, but not deferred until the first click -- that would
   trade a slow boot for a slow first click. Idle is after the map is up and
   before anyone has aimed at an aircraft. */
const _idle = globalThis.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
_idle(() => _load(), { timeout: 3000 });

export const showDetail = (...a) => _call("showDetail", a);
export const closeDetail = (...a) => _call("closeDetail", a);
export const refreshDetail = (...a) => _call("refreshDetail", a);
export const startDetailRotor = (...a) => _call("startDetailRotor", a);
export const showDetailLoading = (...a) => _call("showDetailLoading", a);
export const reseedChartData = (...a) => _call("reseedChartData", a);
export const offerNaming = (...a) => _call("offerNaming", a);
export const setCommonsPlace = (...a) => _call("setCommonsPlace", a);
export const onNamed = (...a) => _call("onNamed", a);

export function getSelectedAircraft() {
  return _m ? _m.getSelectedAircraft() : null;
}
