'use strict'

module.exports = function (req, res) {
  const pathname = req.url.split('?').shift()

  switch (pathname) {
    case '/mock/json':
      res.writeHead(200, { 'content-type': 'application/json' })
      res.write(JSON.stringify({ success: 'yes' }))
      res.end()
  }
}
