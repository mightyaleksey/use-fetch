import {isPlainObject} from '../../src/utils';

test('isPlainObject()', () => {
  expect(isPlainObject()).toBe(false);
  expect(isPlainObject(null)).toBe(false);
  expect(isPlainObject([])).toBe(false);
  expect(isPlainObject({})).toBe(true);
});
