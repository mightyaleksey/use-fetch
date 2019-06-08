'use strict'

var inherit = require('./utils').inherit

module.exports = {
  UseFetchError: UseFetchError,
  HTTPError: HTTPError,
  ParseError: ParseError,
  TimeoutError: TimeoutError
}

// Using prototype inheritance instead of classes,
// because of incorrect 'instanceof' behavior after
// babel@6 transpiling and terrible workarounds.
function UseFetchError (name, message, response) {
  // Skipping Error constructor call for 'this',
  // cause it acts like 'new Error()' call
  // and returns new error instance instead of
  // attaching `message`, `name` and other stuff to this.
  Object.defineProperties(this, {
    name: { value: name || 'UseFetchError' },
    message: { value: message }
  })

  // captureStackTrace is not defined in safari 12.0.3
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor)
  }

  if (response !== null) {
    Object.assign(this, {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    })
  }

  Object.defineProperty(this, 'response', {
    value: response
  })
}

inherit(UseFetchError, Error)

function HTTPError (response) {
  UseFetchError.call(
    this,
    'HTTPError',
    'Response code ' + response.status + ' (' + response.statusText + ')',
    response
  )
}

inherit(HTTPError, UseFetchError)

function ParseError (error, response) {
  UseFetchError.call(
    this,
    'ParseError',
    error.message + ' in ' + response.url,
    response
  )
}

inherit(ParseError, UseFetchError)

function TimeoutError (threshold) {
  UseFetchError.call(
    this,
    'TimeoutError',
    'Timed out awaiting for ' + threshold + 'ms',
    null
  )
}

inherit(TimeoutError, UseFetchError)
