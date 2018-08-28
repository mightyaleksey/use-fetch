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

export function isPlainObject(value) {
  return value != null && Object.prototype.toString.call(value) === '[object Object]';
}

export function isUndefined(value) {
  return typeof value === 'undefined';
}

export function wait(delay, value) {
  return new Promise(resolve => setTimeout(resolve, delay, value));
}
