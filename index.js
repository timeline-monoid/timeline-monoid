(() => {
  "use strict";
  const freeMonoid = (operator) => {
    const M = (m) => (!!m && (!!m.M || m.identity))
      ? (m)
      : (() => {
        const a = b => (b.identity) //M
          ? (a)
          : !b.M
            ? (a)(M(b))
            : (() => {
              const ab = M();
              ab.units = a.units.concat(b.units);
              ab.val = ab.units.map(unit => unit.val[0]);
              return ab; // (a)(b)
            })();
        a.val = a.val ? [] : [m];
        a.units = [a];
        a.M = (m) => M(m);
        operator(a);
        return a;
      })();
    M.identity = true;
    return M;
  };
  //Timeline monoid based on freeMonoid =============
  const now = "now";
  const _T = () => freeMonoid(operator);
  const operator = (timeline) => {
    Object.defineProperties(timeline, //detect TL update
      {
        now: { //timeline[now]
          get() {
            return timeline.val[0];
          },
          set(tUpdate) {
            return (() => {
              timeline.val = [tUpdate];
              timeline._wrapF.map(f => f(tUpdate));
            })();
          }
        }
      });
    timeline._wrapF = [];
    timeline._wrap = f => {
      timeline._wrapF[timeline._wrapF.length] = f;
      return timeline;
    };
    timeline._sync = f => timeline.M(timeline99 => timeline
      ._wrap(x => (timeline99[now] = f(x))));
    timeline.wrap = f => timeline.eval()._wrap(f);
    timeline.sync = f => timeline.eval()._sync(f);
    timeline.eval = () => (timeline.evaluated)
    || (timeline.units.length === 1)
      ? timeline
      : (() => {
        timeline.evaluated = true;
        const reset = () => timeline.units
          .map((t, i) => updates[i][now] = 0);
        const update = () => timeline[now] = timeline.units
          .map((t) => t[now]);
        const check = () => (timeline.units
          .map((t, i) => updates[i][now])
          .reduce((a, b) => (a * b)) === 1) //all updated
          ? update()
          : true;
        const updates = timeline.units
          .map((t) => timeline.M()._wrap(check));
        const dummy0 = timeline.units
          .map((t, i) => t._wrap(() => updates[i][now] = 1));
        const dummy1 = timeline._wrap(reset);
        timeline[now] = null; //initial reset
        return timeline;
      })();
    //------------------
    (typeof timeline.val[0] === "function") //_wrapped eventF
      ? timeline.val[0](timeline)
      : true;
  }; //-------operator
  const T = _T();
  //------------------
  const timeline = {
    now: now,
    T: T
  };
  //------------------
  const exporting = (typeof module === "object"
  && typeof module.exports === "object")
    ? module.exports = timeline
    : self.timeline = timeline;
//============================
})();
