'use strict'

const test = require('tape')
const usefetch = require('../src/index')

test('use-fetch -> json -> fetch and parse the response', async (t) => {
  t.plan(1)

  const response = await usefetch('/mock/json', { json: true, retry: 0 })
  t.deepEqual(response.body, { success: 'yes' })
})
