# injection
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]


## Install

Bower
```bash
$ bower install --save github-injection
```

Node
```bash
$ npm install --save github-injection
```

## Usage

### Browser
```js
gitHubInjection(window, function(err) {
  if (err) {
    return console.error(err);
  }
  var el = window.document.getElementsByClassName('header')[0];
  var randomColor = '#' + ((1<<24) * Math.random()|0).toString(16);
  el.style.backgroundColor = randomColor;
});

```

### Node (Browserify)
```js
var gitHubInjection = require('github-injection');

gitHubInjection(window, function(err) {
  if (err) {
    throw err;
  }
  var el = window.document.getElementsByClassName('header')[0];
  var randomColor = '#' + ((1<<24) * Math.random()|0).toString(16);
  el.style.backgroundColor = randomColor;
});

```


## License

Copyright (c) 2015 Stefan Buck. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/github-injection
[npm-image]: https://badge.fury.io/js/github-injection.svg
[travis-url]: https://travis-ci.org/github-linker/injection
[travis-image]: https://travis-ci.org/github-linker/injection.svg?branch=master
[daviddm-url]: https://david-dm.org/github-linker/injection.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/github-linker/injection
[coveralls-url]: https://coveralls.io/r/github-linker/injection
[coveralls-image]: https://coveralls.io/repos/github-linker/injection/badge.png
