import {isPlainObject, isUndefined} from './utils';

export function mergeHeaders(target, source) {
  const headers = {};

  [target, source].forEach(headersObj => {
    if (isPlainObject(headersObj)) {
      Object.keys(headersObj).forEach(header => {
        if (headersObj[header] && typeof headersObj[header] !== 'object') {
          const headerName = header.toLowerCase();
          headers[headerName] = headersObj[header];
        }
      });
    }
  })

  return headers;
}

export function normalize(init, defaults) {
  const opts = Object.assign({}, defaults, init);
  opts.headers = mergeHeaders(defaults.headers, opts.headers);

  if (opts.json) {
    if (isUndefined(opts.headers['content-type']))
      opts.headers['content-type'] = 'application/json';
    if (isUndefined(opts.headers['accept']))
      opts.headers['accept'] = 'application/json';
  }

  const body = opts.body;
  if (isUndefined(body) || body === null) {
    opts.method = (opts.method || 'get').toUpperCase();
  } else {
    if (opts.json) {
      if (isPlainObject(body) || Array.isArray(body)) {
        opts.body = JSON.stringify(body);
      } else {
        throw new TypeError('The `body` option must be a plain Object or Array when the `json` option is used');
      }
    }

    opts.method = (opts.method || 'post').toUpperCase();
  }

  return opts;
}
