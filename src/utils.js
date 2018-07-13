import {HTTPError, ParseError} from './errors';

export function isPlainObject(value) {
  return value != null && Object.prototype.toString.call(value) === '[object Object]';
}

export function isUndefined(value) {
  return typeof value === 'undefined';
}

export function mergeHeaders(target, source) {
  const headers = {};

  [target, source].forEach(headersObj => {
    if (headersObj && typeof headersObj === 'object') {
      Object.keys(headersObj).forEach(header => {
        if (headersObj[header] && typeof headersObj[header] !== 'object') {
          const headerName = header.toLowerCase();
          headers[headerName] = headersObj[header];
        }
      });
    }
  })

  return headers;
}

export function parseJsonResponse(response) {
  return response.json()
    .then(body => {
      Object.defineProperty(response, 'body', {
        configurable: false,
        enumerable: true,
        value: body,
        writable: false,
      });

      return response;
    })
    .catch(error => {
      if (response.ok) {
        throw new ParseError(error, response);
      }

      return response;
    });
}

export function validateResponse(response) {
  if (response.ok === false) {
    throw new HTTPError(response);
  }

  return response;
}
