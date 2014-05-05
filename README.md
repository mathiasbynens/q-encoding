# q-encoding [![Build status](https://travis-ci.org/mathiasbynens/q-encoding.svg?branch=master)](https://travis-ci.org/mathiasbynens/q-encoding) [![Dependency status](https://gemnasium.com/mathiasbynens/q-encoding.svg)](https://gemnasium.com/mathiasbynens/q-encoding)

_q-encoding_ is a character encoding–agnostic JavaScript implementation of [the `Q` encoding as defined by RFC 2047](http://tools.ietf.org/html/rfc2047#section-4.2). It can be used to encode data with any character encoding to its `Q`-encoded form, or the other way around (i.e. decoding).

## Installation

Via [npm](http://npmjs.org/):

```bash
npm install q-encoding
```

Via [Bower](http://bower.io/):

```bash
bower install q-encoding
```

Via [Component](https://github.com/component/component):

```bash
component install mathiasbynens/q-encoding
```

In a browser:

```html
<script src="q.js"></script>
```

In [Narwhal](http://narwhaljs.org/), [Node.js](http://nodejs.org/), and [RingoJS](http://ringojs.org/):

```js
var q = require('q-encoding');
```

In [Rhino](http://www.mozilla.org/rhino/):

```js
load('q.js');
```

Using an AMD loader like [RequireJS](http://requirejs.org/):

```js
require(
  {
    'paths': {
      'q-encoding': 'path/to/q-encoding'
    }
  },
  ['q-encoding'],
  function(q) {
    console.log(q);
  }
);
```

## API

### `q.version`

A string representing the semantic version number.

### `q.encode(input)`

This function takes an encoded byte string (the `input` parameter) and `Q`-encodes it. Each item in the input string represents an octet as per the desired character encoding. Here’s an example that uses UTF-8:

```js
var utf8 = require('utf8');

q.encode(utf8.encode('foo = bar'));
// → 'foo_=3D_bar'

q.encode(utf8.encode('Iñtërnâtiônàlizætiøn☃💩'));
// → 'I=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=92=A9'
```

### `q.decode(text)`

This function takes a `Q`-encoded string of text (the `text` parameter) and `Q`-decodes it. The return value is a ‘byte string’, i.e. a string of which each item represents an octet as per the character encoding that’s being used. Here’s an example that uses UTF-8:

```js
var utf8 = require('utf8');

utf8.decode(q.decode('foo_=3D_bar'));
// → 'foo = bar'

utf8.decode(q.decode('I=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=92=A9'));
// → 'Iñtërnâtiônàlizætiøn☃💩'
```




### Using the `q` binary

To use the `q` binary in your shell, simply install _q-encoding_ globally using npm:

```bash
npm install -g q-encoding
```

After that, you’ll be able to use `q` on the command line. Note that while the _q-encoding_ library itself is character encoding–agnostic, the command-line tool applies the UTF-8 character encoding on all input.

```bash
$ q --encode 'foo = bar'
foo_=3D_bar

$ q --decode 'foo_=3D_bar'
foo = bar
```

Read a local text file, `Quoted-Printable`-encode it, and save the result to a new file:

```bash
$ q --encode < foo.txt > foo-q.txt
```

Or do the same with an online text file:

```bash
$ curl -sL 'http://mths.be/brh' | q --encode > q.txt
```

Or, the opposite — read a local file containing a `Quoted-Printable`-encoded message, decode it back to plain text, and save the result to a new file:

```bash
$ q --decode < q.txt > original.txt
```

See `q --help` for the full list of options.

## Support

_q-encoding_ is designed to work in at least Node.js v0.10.0, Narwhal 0.3.2, RingoJS 0.8-0.9, PhantomJS 1.9.0, Rhino 1.7RC4, as well as old and modern versions of Chrome, Firefox, Safari, Opera, and Internet Explorer.

## Unit tests & code coverage

After cloning this repository, run `npm install` to install the dependencies needed for development and testing. You may want to install Istanbul _globally_ using `npm install istanbul -g`.

Once that’s done, you can run the unit tests in Node using `npm test` or `node tests/tests.js`. To run the tests in Rhino, Ringo, Narwhal, and web browsers as well, use `grunt test`.

To generate the code coverage report, use `grunt cover`.

## Author

| [![twitter/mathias](https://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|
| [Mathias Bynens](http://mathiasbynens.be/) |

## License

_q-encoding_ is available under the [MIT](http://mths.be/mit) license.
