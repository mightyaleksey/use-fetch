'use strict'

const qs = require('querystring')

module.exports = function (req, res) {
  const chunks = req.url.split('?');
  const pathname = chunks.shift()
  const query = qs.parse(chunks.pop())

  switch (pathname) {
    case '/mock/json':
      res.writeHead(200, { 'content-type': 'application/json' })
      res.write(JSON.stringify({ success: 'yes' }))
      res.end()
      break
    case '/mock/ok':
      res.writeHead(200, { 'content-type': 'text/plain' })
      res.write('ok')
      res.end()
      break
  }
}
