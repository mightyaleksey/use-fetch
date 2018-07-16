export function isPlainObject(value) {
  return value != null && Object.prototype.toString.call(value) === '[object Object]';
}

export function isUndefined(value) {
  return typeof value === 'undefined';
}
