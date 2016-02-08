# `handlebars-glob`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

Effortless registration of [Handlebars][handlebars] partials, helpers, and decorators.

## Install

    $ npm install --save handlebars-glob

## Usage

```
┣━ index.js
┣━ decorators/
┃  ┣━ currency.js
┃  ┗━ i18n.js
┣━ helpers/
┃  ┣━ link.js
┃  ┗━ list.js
┗━ partials/
   ┣━ footer.hbs
   ┗━ header.hbs
```

```js
var handlebars = require('handlebars');
var handlebarsGlob = require('handlebars-glob');

handlebarsGlob(handlebars)
    .decorators('./decorators/**/*.js')
    .helpers('./helpers/**/*.js')
    .partials('./partials/**/*.{hbs,js}');

console.log(handlbars.decorators);
// { currency: fn(), i18n: fn() }

console.log(handlbars.helpers);
// { link: fn(), list: fn() }

console.log(handlbars.partials);
// { footer: fn(), header: fn() }
```

### Registering Files

You may use `handlebars-glob` to require and register any partials file or any module that exports a function, an object, or a `register` factory.

#### Exporting a Function

Files may export a default function, or Handlebars' `require.extensions` hook may be used to load an `.hbs` file which returns a function.

```js
module.exports = function () {
    // do something
};
```

or

```js
export default function () {
    // do something
}
```

The function will be registered based on the globbed portion of a given path.

```
┣━ index.js
┗━ partials/
   ┣━ components
   ┃  ┣━ link.js
   ┃  ┗━ list.js
   ┗━ layouts
      ┣━ one-column.hbs
      ┗━ two-column.hbs
```

```js
hbglob
    .partials('./partials/**/*.{hbs,js}');
// registers the partials:
// - `components/link`
// - `components/list`
// - `layouts/one-column`
// - `layouts/two-column`

hbglob
    .partials('./partials/components/*.js')
    .partials('./partials/layouts/*.hbs');
// registers the partials:
// - `link`
// - `list`
// - `one-column`
// - `two-column`

hbglob
    .partials([
        './partials/**/*.{hbs,js}',
        '!./partials/layouts/**'
    ])
    .partials('./partials/layouts/*.hbs');
// registers the partials:
// - `components/link`
// - `components/list`
// - `one-column`
// - `two-column`
```

Helpers and decorators are handled similarly, but path separators and non-word characters are replaced with hyphens to avoid having to use the [segment-literal notation][square] inside templates.

```
┣━ index.js
┗━ helpers/
   ┣━ format
   ┃  ┣━ date.js
   ┃  ┗━ number.round.js
   ┗━ list
      ┣━ group-by.js
      ┗━ order-by.js
```

```js
hbglob
    .helpers('./helpers/**/*.js');
// registers the helpers:
// - `format-date`
// - `format-number-round`
// - `list-group-by`
// - `list-order-by`
```

#### Exporting an Object

If a file exports an object, that object is registered with Handlebars directly where the object keys are used as names. For example, the following file exports an object that will cause `baz` and `qux` to be registered, regardless of the file path:

```js
module.exports = {
    baz: function () {
        // do something
    },
    qux: function () {
        // do something
    }
};
```

or

```js
export function baz() {
    // do something
}

export function qux() {
    // do something
}
```

#### Exporting a Factory

In cases where a direct reference to the instance of Handlebars in use is needed, files may export a `register` function. For example, the following file will define a new helper called `foo-bar`, regardless of the file path.

```js
module.exports.register = function (handlebars) {
    handlebars.registerHelper('foo-bar', function (text, url) {
        var result = '<a href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);
    });
};
```

or

```js
export function register(handlebars) {
    handlebars.registerHelper('foo-bar', function (text, url) {
        var result = '<a href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);
    });
}
```

### Registering Objects

As a convenience, objects may also be used to register partials, helpers, and decorators exactly like the native `registerPartial`, `registerHelper`, and `registerDecorator` methods. This makes it easy to do all of your registration in one go.

```js
handlebarsGlob(hb)
    // Decorators
    .decorators('./decorators/**/*.js')
    .decorators({
        foo: function () { ... },
        bar: function () { ... }
    })

    // Helpers
    .helpers('./node_modules/handlebars-layouts/index.js')
    .helpers('./helpers/**/*.js')
    .helpers({
        baz: function () { ... },
        qux: function () { ... }
    })

    // Partials
    .partials('./partials/**/*.js')
    .partials({
        boo: '{{#each boo}}{{greet}}{{/each}}',
        far: '{{#each far}}{{length}}{{/each}}'
    });
```

## API

### handlebarsGlob(handlebars): HandlebarsGlob

#### handlebars

Type: `{Handlebars}`

The instance of Handlebars to receive partials, helpers, and decorators.

### .decorators(pattern [, options]): HandlebarsGlob

Requires and registers [decorators][decorators] en-masse from the file-system.

#### pattern

Type: `{String|Array.<String>|Object}`

One or more [`minimatch` glob patterns][minimatch] patterns. Supports negation.

#### options

Type: `{Object}` (optional)

This object is passed directly to [`require-glob`][reqglob] and ultimately to [`node-glob`][glob] so check there for more options.

##### parseDecoratorName

Type: `{Function(options, fileObj): String|Array.<String>}`

A custom [`keygen`][keygen] function used to generate a unique name for a decorator based on the decorator's file path. By default, decorators will be named according to the globbed portion of the file path without the extension, where non-word characters are replaced with hyphens.

### .helpers(pattern [, options]): HandlebarsGlob

Requires and registers [helpers][helpers] en-masse from the file-system.

#### pattern

Type: `{String|Array.<String>|Object}`

One or more [`minimatch` glob patterns][minimatch] patterns. Supports negation.

#### options

Type: `{Object}` (optional)

This object is passed directly to [`require-glob`][reqglob] and ultimately to [`node-glob`][glob] so check there for more options.

##### parseHelperName

Type: `{Function(options, fileObj): String|Array.<String>}`

A custom [`keygen`][keygen] function used to generate a unique name for a helper based on the helper's file path. By default, helpers will be named according to the globbed portion of the file path without the extension, where non-word characters are replaced with hyphens.

### .partials(pattern [, options]): HandlebarsGlob

Requires and registers [partials][partials] en-masse from the file-system.

#### pattern

Type: `{String|Array.<String>|Object}`

One or more [`minimatch` glob patterns][minimatch] patterns. Supports negation.

#### options

Type: `{Object}` (optional)

This object is passed directly to [`require-glob`][reqglob] and ultimately to [`node-glob`][glob] so check there for more options.

##### parsePartialName

Type: `{Function(options, fileObj): String|Array.<String>}`

A custom [`keygen`][keygen] function used to generate a unique name for a partial based on the partial's file path. By default, partials will be named according to the shortest unique file path without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`.

[handlebars]: https://github.com/wycats/handlebars.js#usage
[helpers]: http://handlebarsjs.com/#helpers
[partials]: http://handlebarsjs.com/#partials
[decorators]: https://github.com/wycats/handlebars.js/blob/master/docs/decorators-api.md

[glob]: https://github.com/isaacs/node-glob#usage
[keygen]: https://github.com/shannonmoeller/require-glob#keygen
[minimatch]: https://github.com/isaacs/minimatch#usage
[reqglob]: https://github.com/shannonmoeller/require-glob#usage
[square]: http://handlebarsjs.com/expressions.html#basic-blocks

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/handlebars-glob/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/handlebars-glob
[downloads-img]: http://img.shields.io/npm/dm/handlebars-glob.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/handlebars-glob.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/handlebars-glob
[travis-img]:    http://img.shields.io/travis/shannonmoeller/handlebars-glob.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/handlebars-glob
