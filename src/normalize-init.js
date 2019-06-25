'use strict'

var isPlainObject = require('./utils').isPlainObject
var isUndefined = require('./utils').isUndefined

module.exports = {
  normalizeHeaders: normalizeHeaders,
  normalizeInit: normalizeInit
}

function normalizeHeaders (headers) {
  if (isPlainObject(headers)) {
    return Object.keys(headers).reduce(function (nextHeaders, header) {
      nextHeaders[header.toLowerCase()] = headers[header]
      return nextHeaders
    }, {})
  }

  return {}
}

function normalizeInit (init, defaults) {
  var options = Object.assign({}, defaults, init)

  var headers = Object.assign(
    normalizeHeaders((defaults || {}).headers),
    normalizeHeaders((init || {}).headers)
  )

  if (options.json) {
    if (isUndefined(headers['content-type'])) {
      headers['content-type'] = 'application/json'
    }

    if (isUndefined(headers.accept)) {
      headers.accept = 'application/json'
    }
  }

  var body = options.body
  var method = options.method

  if (body == null) {
    method = method || 'get'
  } else {
    if (options.json) {
      if (isPlainObject(body) || Array.isArray(body)) {
        options.body = JSON.stringify(body)
      } else {
        throw new TypeError('The `body` option must be a plain Object or Array when the `json` option is used')
      }
    }

    method = method || 'post'
  }

  method = method.toUpperCase()

  var retry = {
    retries: typeof options.retry === 'number' ? options.retry : 2,
    methods: ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504]
  }

  if (isPlainObject(options.retry)) {
    Object.assign(retry, options.retry)
  }

  return Object.assign(options, {
    headers: headers,
    method: method,
    retry: retry
  })
}
