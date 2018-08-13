import useFetch from '../../src/use-fetch';
import {HTTPError, ParseError} from '../../src/errors';

test('useFetch() should apply defaults', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(null);

  useFetch('https://yandex.ru/');

  expect(fetch).toBeCalledWith('https://yandex.ru/', {
    credentials: 'same-origin',
    headers: {},
    json: false,
    method: 'GET',
    redirect: 'follow',
    throwHttpErrors: true,
    timeout: 0,
  });
});

test('useFetch() should overwrite defaults', () => {
  fetch.resetMocks();
  fetch.mockResponseOnce(null);

  useFetch('https://yandex.ru/', {json: true, throwHttpErrors: false});

  expect(fetch).toBeCalledWith('https://yandex.ru/', {
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    json: true,
    method: 'GET',
    redirect: 'follow',
    throwHttpErrors: false,
    timeout: 0,
  });
});

test('useFetch() json=true, should parse the response', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('{"success": "ok"}');

  const response = await useFetch('https://yandex.ru/', {json: true});
  expect(response.body).toEqual({success: 'ok'});
});

test('useFetch() json=true, should throw a ParseError', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('{success: "ok"}', {status: 200, url: 'https://yandex.ru/'});

  try {
    await useFetch('https://yandex.ru/', {json: true});
  } catch (error) {
    expect(error).toBeInstanceOf(ParseError);
    expect(error).toHaveProperty('statusCode');
    expect(error.statusCode).toBe(200);
    expect(error).toHaveProperty('statusMessage');
    expect(error).toHaveProperty('url');
    expect(error.url).toBe('https://yandex.ru/');
  }
});

test('useFetch() json=true, should parse non-200 responses', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('{"success": "fail"}', {status: 404, url: 'https://yandex.ru/'});

  try {
    await useFetch('https://yandex.ru/', {json: true});
  } catch (error) {
    expect(error).toBeInstanceOf(HTTPError);
    expect(error.response.body).toEqual({success: 'fail'});
  }
});

test('useFetch() json=true, should ignore errors on invalid non-200 responses', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('not found', {status: 404, url: 'https://yandex.ru/'});

  try {
    await useFetch('https://yandex.ru/', {json: true});
  } catch (error) {
    expect(error).toBeInstanceOf(HTTPError);
  }
});

test('useFetch() throwHttpErrors=true, should throw HTTPError', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('not found', {status: 404, url: 'https://yandex.ru/'});

  try {
    await useFetch('https://yandex.ru/', {json: false, throwHttpErrors: true});
  } catch (error) {
    expect(error).toBeInstanceOf(HTTPError);
    expect(error).toHaveProperty('statusCode');
    expect(error.statusCode).toBe(404);
    expect(error).toHaveProperty('statusMessage');
    expect(error).toHaveProperty('url');
    expect(error.url).toBe('https://yandex.ru/');
  }
});

test('useFetch() throwHttpErrors=false, should return response', async () => {
  fetch.resetMocks();
  fetch.mockResponseOnce('not found', {status: 404, url: 'https://yandex.ru/'});

  const response = await useFetch('https://yandex.ru/', {json: false, throwHttpErrors: false});
  expect(response).toHaveProperty('ok');
  expect(response.ok).toBe(false);
  expect(response).toHaveProperty('status');
  expect(response.status).toBe(404);
});
