import {isPlainObject, mergeHeaders} from '../../src/utils';

test('isPlainObject()', () => {
  expect(isPlainObject()).toBe(false);
  expect(isPlainObject(null)).toBe(false);
  expect(isPlainObject([])).toBe(false);
  expect(isPlainObject({})).toBe(true);
});

test('mergeHeaders()', () => {
  const source = {
    'X-Forwarded-For': null,
    'X-Forwarded-Host': undefined,
    'X-Request-Id': 1,
  };
  const result = {
    'x-request-id': 1,
  };

  expect(mergeHeaders(source, null)).not.toBe(result);
  expect(mergeHeaders(source, null)).toEqual(result);
  expect(mergeHeaders(undefined, source)).not.toBe(result);
  expect(mergeHeaders(undefined, source)).toEqual(result);
});
