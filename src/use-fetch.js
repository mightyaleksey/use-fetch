'use strict'

/* global self */
var HTTPError = require('./errors').HTTPError
var ParseError = require('./errors').ParseError
var TimeoutError = require('./errors').TimeoutError
var wait = require('./utils').wait
var normalize = require('./normalize-init').normalizeInit

// used to compare with response to distinguish real response from timeout
var timeoutResponse = { ok: false }

module.exports = {
  createFetch: createFetch
}

/**
 *
 * @param {string}  input
 * @param {object}  init
 * @param {boolean} init.json
 * @param {boolean} init.throwHttpErrors
 * @param {number}  init.timeout
 */
function usefetch (input, init) {
  var retryCount = 0

  return fetch(input, init)
    .then(handleRetries)
    .then(handleErrors)
    .then(handleResponse)

  function fetch (input, init) {
    if (init.timeout > 0) {
      return Promise.race([
        self.fetch(input, init),
        wait(init.timeout, timeoutResponse)
      ])
    }

    return self.fetch(input, init)
  }

  function handleRetries (response) {
    if (
      (response === timeoutResponse || !response.ok) &&
      init.retry.retries > retryCount &&
      init.retry.methods.includes(init.method) &&
      init.retry.statusCodes.includes(response.status)
    ) {
      // todo check retry-after header
      var timeToWait = 1000 * Math.pow(2, retryCount) + Math.random() * 100
      retryCount++

      return wait(timeToWait)
        .then(function () {
          return fetch(input, init)
        })
        .then(handleRetries)
    }

    return response
  }

  function handleErrors (response) {
    if (response === timeoutResponse) {
      throw new TimeoutError(init.timeout)
    }

    if (!response.ok && init.throwHttpErrors) {
      throw new HTTPError(response)
    }

    return response
  }

  function handleResponse (response) {
    if (init.json) {
      return response.json()
        .then(function (body) {
          Object.defineProperty(response, 'body', {
            configurable: false,
            enumerable: true,
            value: body,
            writable: false
          })

          return response
        })
        .catch(function (error) {
          throw new ParseError(error, response)
        })
    }

    return response
  }
}

function createFetch (defaults) {
  return function (input, init) {
    var options = normalize(init, defaults)
    return usefetch(input, options)
  }
}
