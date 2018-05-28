(() => {
  "use strict";
  const now = "now";
  const T = (t = []) => (t.wrapF)
    ? t
    : (() => {
      const t0 = t1 => {
        const t01 = T((timeline) => { //construct binded TL event
          timeline.units = (t0.units)
            ? t0.units.concat(t1)
            : [t0, t1];
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
            .map((t) => T().wrap(check));
          const dummy0 = timeline.units
            .map((t, i) => t.wrap(() => updates[i][now] = 1));
          const dummy1 = timeline.wrap(reset);
          timeline[now] = null; //initial reset
        });
        return t01; //  T(t0)(t1)
      };
      Object.defineProperties(t0, //detect TL update
        {
          now: { //a[now]
            get() {
              return t0.val;
            },
            set(tUpdate) {
              return (() => {
                t0.val = tUpdate;
                t0.wrapF.map(f => f(tUpdate));
              })();
            }
          }
        });
      t0.wrapF = [];
      t0.wrap = f => {
        t0.wrapF[t0.wrapF.length] = f;
        return t0;
      };
      t0.sync = f => T(t => t0.wrap(a => t[now] = f(a)));
      t0.and = t1 => T(t0)(t1); //  === t0(t1)
      t0.or = t1 => T(
        t01 => {
          t0.wrap(t => t01[now] = t);
          t1.wrap(t => t01[now] = t);
        });
      //------------------
      (typeof t === "function") //wrapped eventF
        ? t(t0)
        : true;
      return t0;
    })();
  T.val = t => t;
  //------------------
  if (typeof module !== "undefined" && module.exports) {
    module.exports = T;
  } else {
    window.T = T;
  }
//============================
})();
