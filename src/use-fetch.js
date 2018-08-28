import { HTTPError, ParseError, TimeoutError } from './errors';
import { normalizeInit as normalize } from './normalize-init';
import { wait } from './utils';

// used to compare with response to distinguish real response from timeout
const timeoutResponse = { ok: false };

/**
 *
 * @param {string}  input
 * @param {object}  init
 * @param {boolean} init.json
 * @param {boolean} init.throwHttpErrors
 * @param {number}  init.timeout
 */
function useFetch(input, init) {
  let retryCount = 0;

  return fetch(input, init)
    .then(handleRetries)
    .then(handleErrors)
    .then(handleResponse);

  function fetch(input, init) {
    if (init.timeout > 0) {
      return Promise.race([
        self.fetch(input, init),
        wait(init.timeout, timeoutResponse),
      ]);
    }

    return self.fetch(input, init);
  }

  function handleRetries(response) {
    if (
      (response === timeoutResponse || !response.ok) &&
      init.retry.retries > retryCount &&
      init.retry.methods.includes(init.method) &&
      init.retry.statusCodes.includes(response.status)
    ) {
      // todo check retry-after header
      const timeToWait = 1000 * Math.pow(2, retryCount) + Math.random() * 100;
      retryCount++;

      return wait(timeToWait)
        .then(() => fetch(input, init))
        .then(handleRetries);
    }

    return response;
  }

  function handleErrors(response) {
    if (response === timeoutResponse) {
      throw new TimeoutError(init.timeout);
    }

    if (!response.ok && init.throwHttpErrors) {
      throw new HTTPError(response);
    }

    return response;
  }

  function handleResponse(response) {
    if (init.json) {
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
          throw new ParseError(error, response);
        });
    }

    return response;
  }
}

export function createFetch(defaults) {
  return (input, init) => {
    const options = normalize(init, defaults);
    return useFetch(input, options);
  };
}

export default createFetch({
  // spec
  credentials: 'same-origin',
  redirect: 'follow',
  // custom
  json: false,
  retry: 2,
  throwHttpErrors: true,
  timeout: 0,
});
