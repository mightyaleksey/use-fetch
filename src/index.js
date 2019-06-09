'use strict'

var HTTPError = require('./errors').HTTPError
var ParseError = require('./errors').ParseError
var TimeoutError = require('./errors').TimeoutError
var createFetch = require('./use-fetch').createFetch

var usefetch = createFetch({
  // spec
  credentials: 'same-origin',
  redirect: 'follow',
  // custom
  json: false,
  retry: 2,
  throwHttpErrors: true,
  timeout: 0
})

usefetch.HTTPError = HTTPError
usefetch.ParseError = ParseError
usefetch.TimeoutError = TimeoutError
usefetch.createFetch = createFetch

module.exports = usefetch
