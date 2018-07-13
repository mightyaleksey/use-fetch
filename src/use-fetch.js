import {
  isPlainObject,
  isUndefined,
  mergeHeaders,
  parseJsonResponse,
  validateResponse,
} from './utils';

export function createFetch(defaultOptions) {
  const defaults = defaultOptions || {};
  return useFetch;

  /**
   *
   * @param {string} input
   * @param {object} [init]
   * @param {boolean} init.json
   * @param {number} init.retry // todo
   * @param {boolean} init.throwHttpErrors
   * @param {number} init.timeout // todo
   */
  function useFetch(input, init) {
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

    let request = self.fetch(input, opts);

    if (opts.json) {
      request = request.then(parseJsonResponse);
    }

    if (opts.throwHttpErrors) {
      request = request.then(validateResponse);
    }

    return request;
  }
}

export default createFetch({
  credentials: 'same-origin',
  json: false,
  redirect: 'follow',
  throwHttpErrors: true,
});
