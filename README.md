# `handlebars-registrar`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url]

Effortless wiring of Handlebars helpers and partials.

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
```

#### Options

### `cwd` `{String}`

Current working directory. Defaults to `process.cwd()`.

### `helpers` `{String|Array.<String>}`

Glob string or array of glob strings matching helper files. Helper files are JavaScript files that define one or more helpers.

As a single helper function:

```js
// lower.js
module.exports = function (text) {
    return String(text).toLowerCase();
};
```

When registering an unnamed helper, the helper will be named according to the file path and name without the extension. So a helper with a path of `string/upper.js` will be named `string-upper`. Note that path separators are replaced with hyphens to avoid having to use [square brackets](http://handlebarsjs.com/expressions.html#basic-blocks).

As an object of helper functions:

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

As an Assemble registrar:

```js
// assemble.js
module.exports.register = function (Handlebars) {
    Handlebars.registerHelper('lower', function (text) {
        return String(text).toLowerCase();
    });
};
```

### `partials` `{String|Array.<String>}`

Glob string or array of glob strings matching partial files. Partial files are either standalone Handlebars files, or JavaScript files that define one or more helpers.

As a standalone Handlebars file:

```handlebars
{{!-- link.hbs --}}
<a href="{{url}}">{{label}}</a>
```

When registering an unnamed partial, the partial will be named according to the file path and name without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`.

As an object of partials:

```js
// partials.js
module.exports = {
    link: '<a href="{{url}}">{{label}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
};
```

As an Assemble registrar:

```js
// assemble.js
module.exports.register = function (Handlebars) {
    Handlebars.registerPartial('link', '<a href="{{url}}">{{label}}</a>');
    Handlebars.registerPartial('people', '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>');
};
```

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ gulp test

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/handlebars-registrar/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/handlebars-registrar
[downloads-img]: http://img.shields.io/npm/dm/handlebars-registrar.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/handlebars-registrar
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/handlebars-registrar.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/handlebars-registrar
[travis-img]:    http://img.shields.io/travis/shannonmoeller/handlebars-registrar.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/handlebars-registrar
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/handlebars-registrar.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/handlebars-registrar
