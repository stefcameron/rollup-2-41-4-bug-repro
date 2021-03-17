# rollup-2-41-4-bug-repro

## Environment

- OS: macOS 11.2.3
- Node: 14.16.0
- npm: 7.6.1

## Install

__USE NPM 7__ with this lock file.

`npm install` then `npm run build`.

## Reproduction

Run `npm run dev` and `npm run prod`.

The dev build outputs to `./dist/repro.dev.js` and the prod build to `./dist/repro.js`.

Compare both output files. Because `util.js` has `DEV && rtv.verify(color, cssHexColorTs);`, and `DEV=false` in the prod build, even though `typesets.js` doesn't "scope" its code with `DEV &&`, the `DEV &&` in `util.js` should result in the elimination of both `rtvjs` and `./typesets` modules from `util.js`, resulting in no `rtvjs` reference in the final bundle.

That was the behavior until `rollup@2.41.3`. But under `2.41.4`, the prod bundle looks like this:

```javascript
'use strict';

var rtv = require('rtvjs');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var rtv__namespace = /*#__PURE__*/_interopNamespace(rtv);

// in reality, this would be a more complex RTV.js typeset...
rtv__namespace.STRING;

const hexToRgb = function (color) {
  return color; // in reality, do the stuff to convert the color to 'rgb(...)'
};

console.log(hexToRgb('#00ff00')); // #00ff00
```

Notice that while the `cssHexColorTs` import has been eliminated, `typesets.js` is still pulled in, as is the reference to `rtvjs`, and we end-up with an orphaned expression (that used to be assigned to `cssHexColorTs` in `typesets.js`): `rtv__namespace.STRING;`

Now update `package.json` to reference `2.41.3` and run `npm run prod` again, and you'll get this in `./dist/repro.js`:

```javascript
'use strict';

const hexToRgb = function (color) {
  return color; // in reality, do the stuff to convert the color to 'rgb(...)'
};

console.log(hexToRgb('#00ff00')); // #00ff00
```

Which is what I'm expecting...
