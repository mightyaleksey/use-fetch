import { normalizeHeaders, normalizeInit } from '../../src/normalize-init';

describe('normalizeHeaders()', () => {
  it('convert keys to lower case', () => {
    expect(normalizeHeaders({
      'accept': '*/*',
      'X-Request-Id': 'abc',
    }))
      .toEqual({
        'accept': '*/*',
        'x-request-id': 'abc',
      });
  });

  it('handle invalid value', () => {
    expect(normalizeHeaders()).toEqual({});
    expect(normalizeHeaders(null)).toEqual({});
    expect(normalizeHeaders([])).toEqual({});
  });
});

describe('normalizeInit()', () => {
  it('handle headers', () => {
    expect(normalizeInit())
      .toEqual(expect.objectContaining({
        headers: {},
      }));

    expect(normalizeInit(
      { headers: { 'X-Request-Id': 'abc' } },
      { headers: { 'x-rEQUEST-iD': 'def' } }
    ))
      .toEqual(expect.objectContaining({
        headers: { 'x-request-id': 'abc' },
      }));

    expect(normalizeInit(
      { headers: {} },
      { headers: { 'x-rEQUEST-iD': 'def' } }
    ))
      .toEqual(expect.objectContaining({
        headers: { 'x-request-id': 'def' },
      }));
  });
});
