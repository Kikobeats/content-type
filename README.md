# @kikobeats/content-type

![Last version](https://img.shields.io/github/tag/kikobeats/@kikobeats/content-type.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/kikobeats/@kikobeats/content-type.svg?style=flat-square)](https://coveralls.io/github/kikobeats/@kikobeats/content-type)
[![NPM Status](https://img.shields.io/npm/dm/@kikobeats/content-type.svg?style=flat-square)](https://www.npmjs.org/package/@kikobeats/content-type)

> A fast way to get the content type from the input string.

This is a lightweight version of [jshttp/content-type](https://github.com/jshttp/content-type) for scenarios where you only want to get the content type value without parameters.

It's 90% faster; see [benchmark](benchmark/README.md) to know more.

## Install

```bash
$ npm install @kikobeats/content-type --save
```

## Usage

Let's say the input string is `'text/html; charset=utf-8;'`.

Use the library to return the content type stripping parameters:

```js
const contentType = require('@kikobeats/content-type')
contentType(res.headers['content-type'])
// => text/html
```

## API

### getContentType(input, [options])

#### input

*Required*<br>
Type: `string`

The input for getting the content type.

#### options

##### strict

Type: `boolean`<br>
Default: `false`

When strict is enabled, it will return null when the input doesn not follow conten-type header spec.

## License

**@kikobeats/content-type** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/@kikobeats/content-type/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/@kikobeats/content-type/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)
