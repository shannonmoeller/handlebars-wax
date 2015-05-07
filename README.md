# `handlebars-registrar`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url]

Effortless wiring of Handlebars helpers and partials. Used internally by [`gulp-hb`][gulp-hb] and [`grunt-hb`][grunt-hb].

[gulp-hb]: https://github.com/shannonmoeller/gulp-hb
[grunt-hb]: https://github.com/shannonmoeller/grunt-hb

## Install

    $ npm install --save-dev handlebars-registrar

## Api

Helpers are registered by passing in your instance of Handlebars. This allows
you to selectively register the helpers on various instances of Handlebars.

### `registrar(handlebars[, options])`

- `handlebars` `{Handlebars}` - An instance of Handlebars.
- `options` `{Object}`

```js
var handlebars = require('handlebars'),
    registrar = require('handlebars-registrar');

registrar(handlebars, {
	helpers: './helpers/**/*.js',
	partials: [
		'./partials/**/*.{hbs,js}',
		'./layouts/**/*.hbs'
	]
});

console.log(handlbars.helpers);
console.log(handlbars.partials);
```

#### Options

### `bustCache` `{Boolean}` (default: `false`)

Whether to force a reload of helpers and partials by deleting them from the cache. Useful inside watch tasks.

### `cwd` `{String}`

Current working directory. Defaults to `process.cwd()`.

### `helpers` `{String|Array.<String>|Object|Function}`

A glob string matching helper files, an array of glob strings, an [object of helpers](http://handlebarsjs.com/reference.html#base-registerHelper), or a function returning any of these. Globbed helper files are JavaScript files that define one or more helpers.

```js
helpers: './src/assets/helpers/**/*.js'
```

```js
helpers: [
    './node_modules/handlebars-layouts/index.js',
    './src/assets/helpers/**/*.js'
]
```

```js
helpers: {
    lower: function (text) {
        return String(text).toLowerCase();
    },

    upper: function (text) {
        return String(text).toUpperCase();
    }
}
```

When including helpers using globs, modules may export a single helper function. These helpers will be named by calling `parseHelperName`.

```js
// lower.js
module.exports = function (text) {
    return String(text).toLowerCase();
};
```

Helpers may also export an object of named functions.

```js
// helpers.js
module.exports = {
    lower: function (text) {
        return String(text).toLowerCase();
    },

    upper: function (text) {
        return String(text).toUpperCase();
    }
};
```

If you need a reference to the handlebars instance inside of a helper, you may expose a factory `register` method.

```js
// helpers.js
module.exports.register = function (handlebars) {
    handlebars.registerHelper('link', function(text, url) {
        text = handlebars.Utils.escapeExpression(text);
        url  = handlebars.Utils.escapeExpression(url);

        var result = '<a href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);
    });
};
```

### `parseHelperName` `Function(file) : String`

By default, standalone helpers will be named according to the shortest unique file path without the extension. So a helper with a path of `string/upper.js` will be named `string-upper`. Note that path separators are replaced with hyphens to avoid having to use [square brackets](http://handlebarsjs.com/expressions.html#basic-blocks). You may optionally provide your own name parser. This is helpful in cases where you may wish to exclude the directory names.

```js
parseHelperName: = function (file) {
    // this.handlebars <- current handlebars instance
    // file.path       <- full system path with extension
    // file.shortPath  <- shortest unique path without extension
    // file.exports    <- result of requiring the helper

    // Ignore directory names
    return path.basename(file.path);
};
```

### `partials` `{String|Array.<String>|Object|Function}`

A glob string matching partial files, an array of glob strings, an [object of partials](http://handlebarsjs.com/reference.html#base-registerPartial), or a function returning any of these. Globbed partial files are either standalone Handlebars files, or JavaScript files that define one or more helpers.

```js
partials: './src/assets/partials/**/*.{hbs,js}'
```

```js
partials: [
    './src/assets/vendor/some-theme/partials/**/*.hbs',
    './src/assets/partials/**/*.hbs'
]
```

```js
partials: {
    link: '<a href="{{url}}">{{text}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
}
```

When including paritals using globs, partials may be standalone handlebars files. Each partial will be named by calling `parsePartialName`.

```handlebars
{{!-- link.hbs --}}
<a href="{{url}}">{{text}}</a>
```

Partials may also be modules that export an object of named partials.

```js
// partials.js
module.exports = {
    link: '<a href="{{url}}">{{text}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
};
```

If you need a reference to the handlebars instance when defining a partial, you may expose a factory `register` method.

```js
// partials.js
module.exports.register = function (handlebars) {
    handlebars.registerPartial({
        item: '<li>{{label}}</li>',
        link: '<a href="{{url}}">{{label}}</a>'
    });
};
```

### `parsePartialName` `Function(file) : String`

By default, standalone partials will be named according to the shortest unique file path without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`. You may optionally provide your own name parser. This is helpful in cases where you may wish to exclude the directory names.

```js
parsePartialName: = function (file) {
    // this.handlebars <- current handlebars instance
    // file.path       <- full system path with extension
    // file.shortPath  <- shortest unique path without extension
    // file.exports    <- result of requiring the helper

    // Ignore directory names
    return path.basename(file.shortPath);
};
```

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/handlebars-registrar/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/handlebars-registrar
[downloads-img]: http://img.shields.io/npm/dm/handlebars-registrar.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/handlebars-registrar.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/handlebars-registrar
[travis-img]:    http://img.shields.io/travis/shannonmoeller/handlebars-registrar.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/handlebars-registrar
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/handlebars-registrar.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/handlebars-registrar
