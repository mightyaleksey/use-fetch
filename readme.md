# use-fetch

A thin `fetch` wrapper with useful defaults. Inspired by [got](https://github.com/sindresorhus/got).


## Installation

### From Npm
```bash
npm install use-fetch
yarn add use-fetch
```

### From unpckg
```html
<script src="https://unpkg.com/use-fetch@0.0.1/dist/index.js"></script>
<script src="https://unpkg.com/use-fetch@0.0.1/dist/index.min.js"></script>
```


## Usage
```js
import fetch from 'use-fetch';
```

### API

#### fetch(url, [options])
Returns a promise for a `response` object with a `body` property.

##### input
Type: `string` `object`

The URL to request as a string or a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

##### init
Type: `object`

Any of the [fetch init](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) options.

###### headers
Type: `object`<br>
Default: `{}`

Request headers.

###### json
Type: `boolean`
Default: `false`

If set to `true` and `content-type` header is not set, it will be set to `application/json`.

Takes a [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) stream and reads it to completion through the `response.json()`. The result is parsed as JSON and saved to `response.body`. Sets the `accept` header to `application/json`.

`body` must be a plain object or array and will be stringified.


### Advanced
```js
import {createFetch} from 'use-fetch';
```


## Errors
Each error contains (if available) `statusCode`, `statusMessage`, `url` and `response` properties to make debugging easier.

#### fetch.HTTPError
When server response code is not 2xx.

#### fetch.ParseError
When `json` option is enabled, server response code is 2xx, and `response.json()` fails.


## License

> The MIT License
