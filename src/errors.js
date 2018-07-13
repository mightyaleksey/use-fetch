export function inherit(Target, Source) {
  Target.prototype = Object.create(Source.prototype, {
    constructor: {
      configurable: true,
      enumerable: false,
      value: Target,
      writable: true,
    },
  });
}

function UseFetchError(name, message, response) {
  Object.defineProperties(this, {
    name: {value: name || 'UseFetchError'},
    message: {value: message},
  });

  Error.captureStackTrace(this, this.constructor);

  Object.assign(this, {
    statusCode: response.status,
    statusMessage: response.statusText,
    url: response.url,
  });

  Object.defineProperty(this, 'response', {
    value: response,
  });
}

inherit(UseFetchError, Error);

export function HTTPError(response) {
  UseFetchError.call(
    this,
    'HTTPError',
    `Response code ${response.status} (${response.statusText})`,
    response
  );
}

inherit(HTTPError, UseFetchError);

export function ParseError(error, response) {
  UseFetchError.call(
    this,
    'ParseError',
    `${error.message} in ${response.url}`,
    response
  );
}

inherit(ParseError, UseFetchError);
