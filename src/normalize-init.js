import { isPlainObject, isUndefined } from './utils';

export function normalizeHeaders(headers) {
  if (isPlainObject(headers)) {
    return Object.keys(headers).reduce((nextHeaders, header) => {
      nextHeaders[header.toLowerCase()] = headers[header];
      return nextHeaders;
    }, {});
  }

  return {};
}

export function normalizeInit(init, defaults) {
  const options = Object.assign({}, defaults, init);

  const headers = Object.assign(
    normalizeHeaders((defaults || {}).headers),
    normalizeHeaders((init || {}).headers)
  );

  if (options.json) {
    if (isUndefined(headers['content-type'])) {
      headers['content-type'] = 'application/json';
    }

    if (isUndefined(headers.accept)) {
      headers.accept = 'application/json';
    }
  }

  const { body } = options;
  let { method } = options;

  if (body == null) {
    method = method || 'get';
  } else {
    if (options.json) {
      if (isPlainObject(body) || Array.isArray(body)) {
        options.body = JSON.stringify(body);
      } else {
        throw new TypeError('The `body` option must be a plain Object or Array when the `json` option is used');
      }
    }

    method = method || 'post';
  }

  method = method.toUpperCase();

  const retry = {
    retries: typeof options.retry === 'number' ? options.retry : 2,
    methods: ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  };

  if (isPlainObject(options.retry)) {
    Object.assign(retry, options.retry);
  }

  return Object.assign(options, {
    headers,
    method,
    retry,
  });
}
