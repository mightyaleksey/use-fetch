'use strict'

const test = require('tape')
const usefetch = require('../src/index')

function to(promise) {
  return promise
    .then(d => [null, d])
    .catch(e => [e])
}

test('use-fetch -> json -> fetch and parse the response', async (t) => {
  t.plan(1)

  const [, response] = await to(usefetch('/mock/json', { json: true, retry: 0 }))
  t.deepEqual(response.body, { success: 'yes' })
})

test('use-fetch -> json -> throw ParseError for non-json response', async (t) => {
  t.plan(4)

  const url = new URL('/mock/ok', window.location.href).toString()
  const [error] = await to(usefetch('/mock/ok', { json: true, retry: 0 }))

  t.ok(error instanceof usefetch.ParseError)
  t.equal(error.status, 200)
  t.equal(error.statusText, 'OK')
  t.equal(error.url, url)
})
