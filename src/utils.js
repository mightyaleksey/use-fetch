'use strict'

module.exports = {
  inherit: inherit,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  wait: wait
}

function inherit (Target, Source) {
  Target.prototype = Object.create(Source.prototype, {
    constructor: {
      configurable: true,
      enumerable: false,
      value: Target,
      writable: true
    }
  })
}

function isPlainObject (value) {
  return value != null && Object.prototype.toString.call(value) === '[object Object]'
}

function isUndefined (value) {
  return typeof value === 'undefined'
}

function wait (delay, value) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay, value)
  })
}
