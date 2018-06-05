(() => {
  "use strict";
  //=========================
  const {T, now} = require("./index");

  const log = (m) => {
    console.log(m);
    return m;
  };
  const mlog = (msg) => (m) => {
    console.log(msg + ": " + m);
    return m;
  };

  const tLog = T();
  tLog.wrap(log);

  const tLog2 = T();
  tLog2
    .wrap(log)
    .wrap(log);
  tLog2[now] = "----------------";

  tLog[now] = "---identity-------------";
  (() => {
    console.log(
      T
    );
    console.log(
      (T)(T)
    );
    tLog[now] = "----------------";
    tLog[now] = "(T)(a) = (a) = (a)(T)";
    const a = T();
    a[now] = 123;
    console.log(
      (T)(a)
    );
    console.log(
      (a)
    );
    console.log(
      (a)(T)
    );
  })();

  tLog[now] = "----------------";


  (() => {
    const a = T();
    a[now] = 1;
    console.log(a[now]);
  })();

  tLog[now] = "----------------";

  (() => {
    const a = T()
      .wrap(console.log);

    a[now] = 1;
    a[now] = 5;
  })();
  tLog[now] = "----------------";

  (() => {
    const a = T()
      .wrap(console.log)
      .wrap(console.log);

    a[now] = 1;
  })();
  tLog[now] = "----------------";

  (() => {
    const a = T()
      .wrap(console.log);
    const b = a
      .sync(a => a * 2)
      .wrap(console.log);
    a[now] = 1;
    a[now] = 5;
  })();
  tLog[now] = "----------------";
  (() => {
    const a = T()
      .wrap(console.log);

    const b = a
      .sync(a => a * 2)
      .wrap(console.log);

    const c = (a)(b)
      .sync(([a, b]) => a + b)
      .wrap(console.log);

    a[now] = 1;
  })();


  tLog[now] = "----------------";
  (() => {
    const a = T();
    const b = (a).sync(a => a * 2);
    const c = (a)(b).sync(([a, b]) => a + b);
    const abc = (a)(b)(c).wrap(console.log);
    const abc2 = ((a)(b))(c).wrap(console.log);
    const abc3 = (a)((b)(c)).wrap(console.log);

    a[now] = 1;
  //  a[now] = 5;
  })();

  tLog[now] = "----------------";
  const sec1 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 1 sec";
    }, 1000);
  }).wrap(mlog("sec_1"));

  const sec3 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 3 sec";
    }, 3000);
  }).wrap(mlog("sec_3"));

  const sec1and3 = (sec1)(sec3)
    .wrap(console.log); // == T(sec1)(sec3) == sec(sec3)

  (() => {
    const a = T().wrap(mlog("a"));
    const b = T().wrap(mlog("b"));
    const c = T().wrap(mlog("c"));
    const abc = (a)(b)(c).wrap(mlog("abc"));

    a[now] = 1;
    b[now] = 2; //double update
    b[now] = 999; //double update
    c[now] = 3;
    tLog[now] = "----------------";
    a[now] = 77;
    c[now] = 99;
    b[now] = 88;
  })();
  tLog[now] = "----------------";

//============================
})();
