import {HTTPError, ParseError} from './errors';
import {normalize} from './normalize';

function timeout(delay, input) {
  return new Promise((resolve, reject) =>
    reject(new Error('Connection timed out on request ' + input)));
}

function invokeFetch(input, init) {
  if (init.timeout > 0) return Promise.race(
    self.fetch(input, init),
    timeout(init.timeout)
  );

  return self.fetch(input, init);
}

function parseJsonResponse(response) {
  return response.json()
    .then(body => {
      Object.defineProperty(response, 'body', {
        configurable: false,
        enumerable: true,
        value: body,
        writable: false,
      });

      return response;
    })
    .catch(error => {
      if (response.ok) {
        throw new ParseError(error, response);
      }

      return response;
    });
}

function validateResponse(response) {
  if (response.ok === false) {
    throw new HTTPError(response);
  }

  return response;
}

export function createFetch(defaults) {
  return useFetch;

  /**
   *
   * @param {string} input
   * @param {object} [init]
   * @param {boolean} init.json
   * @param {boolean} init.throwHttpErrors
   * @param {number} init.timeout // todo
   */
  function useFetch(input, init) {
    const opts = normalize(init, defaults);
    let request = invokeFetch(input, opts);

    if (opts.json) request = request.then(parseJsonResponse);
    if (opts.throwHttpErrors) request = request.then(validateResponse);

    return request;
  }
}

export default createFetch({
  credentials: 'same-origin',
  json: false,
  redirect: 'follow',
  throwHttpErrors: true,
  timeout: 0,
});
