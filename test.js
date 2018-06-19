(() => {
  "use strict";
  //=========================
  const {T, now, log, mlog} = require("./index");

  const tLog = T();
  tLog.sync(log);

  const tLog2 = T();
  tLog2
    .sync(log)
    .sync(log);
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
    const a = T();
    const tl = a.sync(log);

    a[now] = 1;
    a[now] = 5;
  })();
  tLog[now] = "----------------";

  (() => {
    const a = T();
    const tl = a
      .sync(log)
      .sync(log);

    a[now] = 9;
  })();
  tLog[now] = "----------------";


  (() => {
    const a = T();
    const b = a.sync(a => a * 2);

    const tl_a = a.sync(mlog("a"));
    const tl_b = b.sync(mlog("b"));

    a[now] = 1;
    a[now] = 5;
  })();


  tLog[now] = "----------------";

  (() => {
    const a = T();
    const b = a.sync(a => a * 3);
    const c = a.sync(a => a * 10);

    const tl_a = a.sync(mlog("a"));
    const tl_b = b.sync(mlog("b"));
    const tl_c = c.sync(mlog("c"));

    a[now] = 1;
    a[now] = 5;
  })();


  tLog[now] = "----------------";
  (() => {
    const a = T();
    const b = a
      .sync(a => a * 2);
    const c = (a)(b)
      .sync(([a, b]) => a + b);

    const abc = (a)(b)(c);
    const tl = abc.sync(log);

    const abc2 = abc
      .sync(([a, b, c]) => [a * 2, b * 2, c * 2]);
    const t2 = abc2.sync(log);

    a[now] = 1;
  })();

  tLog[now] = "----------------";
  (() => {
    const a = T();
    const b = (a)
      .sync(a => a * 2);
    const c = (a)(b)
      .sync(([a, b]) => a + b);

    const abc = (a)(b)(c)
      .sync(log);
    const abc2 = ((a)(b))(c)
      .sync(log);
    const abc3 = (a)((b)(c))
      .sync(log);

    a[now] = 1;
    a[now] = 5;
  })();


  (() => {
    const a = T();
    const b = T();
    const c = T();
    const abc = (a)(b)(c);

    const tl_a = a.sync(mlog("a"));
    const tl_b = b.sync(mlog("b"));
    const tl_c = c.sync(mlog("c"));
    const tl_abc = abc.sync(mlog("abc"));

    a[now] = 1;
    b[now] = 2; //double update
    b[now] = 999; //and the most recent value will be used
    c[now] = 3;
    tLog[now] = "----------------";
    a[now] = 77;
    c[now] = 99;
    b[now] = 88;
  })();
  tLog[now] = "----------------";

  tLog[now] = "==file read========";

  (() => {
    const fs = require("fs");

    const startA = T();
    const startB = T();

    const timelineA = T((timeline) => {

      (startA)
        .sync(() => fs
          .readFile("package.json", "utf8", (err, data) => {
            timeline[now] = data;
          }));

    });

    const timelineB = T((timeline) => {

      (startB)
        .sync(() => fs
          .readFile("index.js", "utf8", (err, data) => {
            timeline[now] = data;
          }));

    });
    const start1 = T((timeline) => {
      setTimeout(() => (timeline[now] = true), 1000);
    });
    const start2 = T((timeline) => {
      setTimeout(() => (timeline[now] = true), 2000);
    });

    (() => {
      const delayTL = (start1)
        .sync(() => {
          //=======================================
          tLog[now] = "---async read-------------";

          const asyncStart = T();
          const context = asyncStart
            .sync(() => {
              startA[now] = true;
              startB[now] = true;
            });
          const contextAB = (context)(timelineA)(timelineB)
            .sync(([x, a, b]) => {
              console.log("Async read: Files A and B are now ready");
            //console.log(a); //show file contents if needed
            //console.log(b); //show file contents if needed
            });
          asyncStart[now] = true;
        //=======================================
        });
    })();
    (() => {
      const delayTL = (start2)
        .sync(() => {
          //============================
          (() => { //sync read
            tLog[now] = "---sync read-------------";

            const syncStart = T();
            const context = syncStart
              .sync(() => {
                startA[now] = true;
              });
            const contextA = (context)(timelineA)
              .sync(([x, a]) => {
                console.log("now A has been read");
                // console.log(a); //show file contents if needed
                startB[now] = true;
                return true;
              });
            const contextB = (context)(timelineB)
              .sync(([x, b]) => {
                console.log("then B has been read");
                //    console.log(b); //show file contents if needed
                return true;
              });

            syncStart[now] = true;
          })();
        //============================
        });
    })();
  //---------------------------------------
  })();


//============================
})();
