(() => {
  "use strict";
  //=========================
  const T = require("./index");

  const FUNCTION = 'function';
  const NUMBER = "number";

  const now = "now";

  const err = () => {
    throw new TypeError();
  };

  const log = (m) => (typeof m !== FUNCTION)
    ? (() => {
      console.log(m);
      return m;
    })()
    : err();

  const mlog = (msg) => (m) => (typeof m !== FUNCTION)
    ? (() => {
      console.log(msg + ": " + m);
      return m;
    })()
    : err();

  // return a type checked function
  const type = s => f => x => (typeof x == s)
    ? f(x)
    : err();

  const tLog = T();
  tLog.wrap(log);
  tLog[now] = "----------------";

  const sec1 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 1 sec";
    }, 1000);
  });

  const sec3 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 3 sec";
    }, 3000);
  });

  const sec1or3 = sec1.or(sec3);
  const sec1and3 = sec1.and(sec3); // == T(sec1(sec3) == sec(sec3)

  sec1.wrap(mlog("sec_1"));
  sec3.wrap(mlog("sec_3"));
  sec1or3.wrap(mlog("sec_1_or_3"));
  sec1and3.wrap(mlog("sec_1_and_3"));


  (() => {
    const a = T();
    const b = T();
    const c = T();

    const abc = T(a)(b)(c);

    a.wrap(mlog("a"));
    b.wrap(mlog("b"));
    c.wrap(mlog("c"));
    abc.wrap(mlog("abc"));

    a[now] = 23;
    b[now] = 3;
    b[now] = 0;
    c[now] = 123;
    tLog[now] = "----------------";
    a[now] = 77;
    c[now] = 99;
    b[now] = 88;
  })();
  tLog[now] = "----------------";
  (() => {
    const a = T();
    const b = T(timeline => {
      a.wrap(a => {
        timeline[now] = a * 2;
      })
    });

    a.wrap(mlog("a"));
    b.wrap(mlog("b"));

    a[now] = 1;
  })();

  tLog[now] = "----------------";

  (() => {
    const a = T();
    const b = a.sync(a => a * 2);
    const c = T(a)(b).sync(([a, b]) => a + b);
    const abc = T(a)(b)(c);

    a.wrap(mlog("a"));
    b.wrap(mlog("b"));
    c.wrap(mlog("c"));
    abc.wrap(mlog("abc"));

    a[now] = 1;
    tLog[now] = "----------------";
    a[now] = 7;
  })();
  tLog[now] = "----------------";

//============================
})();
