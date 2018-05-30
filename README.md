

# Timeline Monoid

npm package: [https://www.npmjs.com/package/timeline-monoid](https://www.npmjs.com/package/timeline-monoid)

#### A minimal implementation for monoidal FRP datatype

## Background and Rationale
[Functional Reactive Programming (FRP)](https://wiki.haskell.org/FRP) integrates **time flow** and compositional events into functional programming.

The basic idea is that **a time-varying value can be represented as a function of time**.

[Structure and Interpretation of Computer Programs(SICP)](https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs)
([3.5 Streams](https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-4.html))

>Let's step back and review where this complexity comes from. In an attempt to model real-world phenomena, we made some apparently reasonable decisions: We modeled real-world objects with local state by computational objects with local variables. We identified time variation in the real world with time variation in the computer. We implemented the time variation of the states of the model objects in the computer with assignments to the local variables of the model objects.

>Is there another approach? Can we avoid identifying time in the computer with time in the modeled world? Must we make the model change with time in order to model phenomena in a changing world? **Think about the issue in terms of mathematical functions. We can describe the time-varying behavior of a quantity  ```x```  as a function of time ```x(t)```. If we concentrate on  `x` instant by instant, we think of it as a changing quantity. Yet if we concentrate on the entire time history of values, we do not emphasize change -- the function itself does not change.**
>(Physicists sometimes adopt this view by introducing the *world lines* of particles as a device for reasoning about motion.)

>If time is measured in discrete steps, then **we can model a time function as a (possibly infinite) sequence**. In this section, we will see **how to model change in terms of sequences that represent the time histories of the systems being modeled**. To accomplish this, we introduce new data structures called  ***streams***. From an abstract point of view, a stream is simply a sequence. However, we will find that the straightforward implementation of streams as lists (as in section 2.2.1) doesn't fully reveal the power of stream processing. As an alternative, we introduce the technique of ***delayed evaluation*, which enables us to represent very large (even infinite) sequences as streams**.

>This is really remarkable. Even though stream-withdraw implements a well-defined mathematical function whose behavior does not change, the user's perception here is one of interacting with a system that has a changing state. **One way to resolve this paradox is to realize that it is the user's temporal existence that imposes state on the system.** If the user could step back from the interaction and think in terms of streams of balances rather than individual transactions, the system would appear stateless.
(**Similarly in physics, when we observe a moving particle, we say that the position (state) of the particle is changing. However, from the perspective of the particle's *world line in space-time* there is no change involved.**)

>We began this chapter with the goal of building computational models whose structure matches our perception of the real world we are trying to model. We can model the world as a collection of separate, time-bound, interacting objects with state, or **we can model the world as a single, timeless, stateless unity**. Each view has powerful advantages, but neither view alone is completely satisfactory. A grand unification has yet to emerge.

Our world is modeled as an immutable, timeless, stateless unity from the perspective of physics

![](https://upload.wikimedia.org/wikipedia/commons/6/6f/CMB_Timeline300_no_WMAP.jpg)

Frozen Block Universe and Human Consciousness

![](https://github.com/kenokabe/00img/wiki/block-universe.jpg)

[Conal Elliott(a developer who has contributed to early FRP) explaines](https://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming)
>FRP is about "datatypes that represent a value **over time** ".
>Conventional imperative programming captures these dynamic values only indirectly, through state and mutations. The complete history (past, present, future) has no first class representation. Moreover, only *discretely evolving* values can be (indirectly) captured, since the imperative paradigm is temporally discrete.
> In contrast, FRP captures these evolving values *directly* and has no difficulty with *continuously* evolving values.
>Dynamic/evolving values (i.e., values "over time") are first class values in themselves. You can define them and combine them, pass them into & out of functions.

## `timeline` as a datatype that represents a first-class value over time /  a stream (infinite sequence) in JavaScript

 `timeline` : a datatype that represents **a first class value over time** in JavaScript /  a stream (infinite sequence) / time function as a stream / *world line in space-time*.

### T() : `timeline` instance
`T()` is a `timeline` instance:

```js
    const a = T();
```

### timeline [now]

 As `timeline` is an infinite stream of time, `timeline` has a (a user's perspective) current value: `timeline[now]`, and can be easily get/set as below:

```js
    a[now] = 1;
    console.log(a[now]);
```

```sh
1
```

## `timeline` as a functor

`timeline`datatype is a [functor](https://en.wikipedia.org/wiki/Functor) (a datatype that methods/functions always return the identical datatype, such as [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)).

`timeline` has 2 core methods/functions, `wrap` and `sync`.

### timeline.wrap


`timeline.wrap` returns an identical `timeline` instance (itself) with wrapping a given function that [behave in reactive manner](https://en.wikipedia.org/wiki/Reactive_programming) on every update of `timeline[now]`.

```js
    const a = T()
      .wrap(console.log);

    a[now] = 1;
    a[now] = 5;
```

```sh
1
5
```

As `timeline.wrap` is functor:

```js
    const a = T()
      .wrap(console.log)
      .wrap(console.log);

    a[now] = 1;
```

```sh
1
1
```

### timeline.sync

`timeline.sync` returns a new `timeline` instance that a given function applied to on every update of `timeline[now]`.

It corresponds to `Array.map`, but on TimeLine.

Now we have an equation: `b = a * 2`,

```js
    const a = T()
      .wrap(console.log);

    const b = a
      .sync(a => a * 2)
      .wrap(console.log);

    a[now] = 1;
    a[now] = 5;
```

```sh
1
2
5
10
```

Now, the values `a` and `b` are guaranteed to synchronize with satisfying the equation.

## `timeline` as a monoid

A [monoid](https://en.wikipedia.org/wiki/Monoid) is an [algebraic structure](https://en.wikipedia.org/wiki/Algebraic_structure "Algebraic structure") with a single [associative](https://en.wikipedia.org/wiki/Associative "Associative")  [binary operation](https://en.wikipedia.org/wiki/Binary_operation "Binary operation") and an [identity element](https://en.wikipedia.org/wiki/Identity_element "Identity element").

In algebra,


`0` is an identiy element in +(addition) operation,

```sh
    a + 0 = a  //right identity
    0 + a = a  //left identity
```

`1` is an identity element in *(multiplication) operation,

```sh
    a ∗ 1 = a  //right identity
    1 ∗ a = a  //left identity
```

Associative property

 ```sh
    1 + 2 + 3 = 1 + 2 + 3
    (1+2) + 3 = 1 + (2+3)
        3 + 3 = 1 + 5
            6 = 6
```

A string is also a monoid


`string + string => string`

```sh
    "Hello" + " " + "world"
    = "Hello " + "world"
    = "Hello" + " world"
```

appears to be associative, and identity element is `""`.

### identiy of `timeline`

The identity element of `timeline`  is `T`:

```sh
T
=T(T)
=T(T(T))
...
```
```sh
T(a) = a = a(T)
```
The nature of left identity: `T(a) = a`   is especially important because we should intuitively be aware of that an instance of `timeline` for a given `timeline` instance is identical.

### associative of `timeline`

`timeline` satisfies associative law.

```sh
(a)(b)(c)
= ((a)(b))(c)
= (a)((b)(c))
```

## Timeline composition

Here we can compose `timeline`s.

Now we have 2 equations:

```sh
   b = a * 2
   c = a + b
```

These equations can be easily implemented to a `timeline` code:

```js
const a = T()
  .wrap(console.log);

const b = a
  .sync(a => a * 2)
  .wrap(console.log);

const c = (a)(b)
  .sync(([a, b]) => a + b)
  .wrap(console.log);

a[now] = 1;
```

```sh
1
2
3
```

If we need a synchronized update of all of `a`,`b`,`c` which is an atomic update of `[a,b,c]`,

```js
const a = T();
const b = a.sync(a => a * 2);
const c = (a)(b).sync(([a, b]) => a + b);
const abc = (a)(b)(c).wrap(console.log);

a[now] = 1;
a[now] = 5;
```

```sh
[ 1, 2, 3 ]
[ 5, 10, 15 ]
```

The values of `a`,`b`,`c` are now guaranteed to synchronize with satisfying the equation.

In a practical program, in this manner, we can define dependencies of events, IO, etc., and `timeline` is a complete alternative of [State Monad](https://en.wikibooks.org/wiki/Haskell/Understanding_monads/State) or Continuation Monad such as [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) simply because there is "no state"  as discussed earlier.

##   Event encapsulation

When we define a `timeline` with an empty argument:
```js
    const a = T();
 ```
is it really an empty `timeline`?

The fact is it is not empty because actually, we occasionally "manually" update the `timeline` value as

```js
    a[now] = 1;
 ```
The argument of `timeline` in empty, Nevertheless, various inputs would happen to the `timeline`. In a sense, implicitly, our real-world events or time function of the world: `f(t)` are encapsulated to it.

```js
    const a = T(realWorldTimeFunction);
 ```

Having said that. any event functions can be encapsulated to `timeline` instances.

They can be IO inputs or simply a timer event,

```js
  const sec1 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 1 sec";
    }, 1000);
  }).wrap(console.log);
```

```sh
yay!! after 1 sec
```

Obviously, the "custom" `timelilne` can be composed.

```js
  const sec3 = T((timeline) => {
    setTimeout(() => {
      timeline[now] = "yay!! after 3 sec";
    }, 3000);
  }).wrap(console.log);
```

```js
  const sec1and3 = (sec1)(sec3)
    .wrap(console.log);
```

```sh
[ 'yay!! after 1 sec', 'yay!! after 3 sec' ]
```

## Tiny library less than 100 lines

**Timeline Monoid** is a minimal library and the code is less than 100 lines.

To build up this library, `timeline` itself is extensively used.

### SourceCode :
```js
(() => {
  "use strict";
  const now = "now";
  const T = (t = []) => (t.wrapF || t.identity)
    ? t
    : (() => {
      const t0 = t1 => (t1.identity) //T
        ? t0
        : (() => {
          const t01 = T((timeline) => { //construct binded TL event
            const t0units = (t0.units)
              ? t0.units : [t0];
            const t1units = (t1.units)
              ? t1.units : [t1];
            timeline.units = t0units.concat(t1units);
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
        })();
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
  T.identity = true;
  //------------------
  if (typeof module !== "undefined" && module.exports) {
    module.exports = T;
  } else {
    window.T = T;
  }
//============================
})();
```


## MIT License
