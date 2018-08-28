import { UseFetchError } from '../../src/errors';

test('errors inheritance', () => {
  const fetchError = new UseFetchError(
    'FetchError',
    'ooops',
    {}
  );

  expect(fetchError).toBeInstanceOf(Error);
  expect(fetchError).toBeInstanceOf(UseFetchError);
});

test('errors props', () => {
  const fetchError = new UseFetchError(
    'FetchError',
    'ooops',
    {}
  );

  expect(fetchError).toHaveProperty('name', 'FetchError');
  expect(fetchError).toHaveProperty('message', 'ooops');
});
