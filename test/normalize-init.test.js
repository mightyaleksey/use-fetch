'use strict'

const test = require('tape')
const { normalizeHeaders, normalizeInit } = require('../src/normalize-init')

test('normalizeHeaders -> convert keys to lower case', t => {
  t.plan(1)
  t.deepEqual(
    normalizeHeaders({
      'accept': '*/*',
      'X-Request-Id': 'abc'
    }),
    {
      'accept': '*/*',
      'x-request-id': 'abc'
    }
  )
})

test('normalizeHeaders -> handle invalid value', t => {
  t.plan(3)
  t.deepEqual(normalizeHeaders(), {})
  t.deepEqual(normalizeHeaders(null), {})
  t.deepEqual(normalizeHeaders([]), {})
})

test('normalizeInit -> handle headers', t => {
  t.plan(3)
  t.deepEqual(normalizeInit().headers, {})
  t.deepEqual(
    normalizeInit(
      { headers: { 'X-Request-Id': 'abc' } },
      { headers: { 'x-rEQUEST-iD': 'def' } }
    ).headers,
    { 'x-request-id': 'abc' }
  )
  t.deepEqual(
    normalizeInit(
      { headers: {} },
      { headers: { 'x-rEQUEST-iD': 'def' } }
    ).headers,
    { 'x-request-id': 'def' }
  )
})
