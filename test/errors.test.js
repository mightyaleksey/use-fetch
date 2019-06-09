'use strict'

const test = require('tape')
const { UseFetchError } = require('../src/errors')

test('errors inheritance', t => {
  const fetchError = new UseFetchError(
    'FetchError',
    'ooops',
    {}
  )

  t.plan(2)
  t.ok(fetchError instanceof Error)
  t.ok(fetchError instanceof UseFetchError)
})

test('errors props', t => {
  const fetchError = new UseFetchError(
    'FetchError',
    'ooops',
    {}
  )

  t.plan(2)
  t.equal(fetchError.name, 'FetchError')
  t.equal(fetchError.message, 'ooops')
})
