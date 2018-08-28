import usefetch from '../../src/use-fetch';
import to from '../to';
import { HTTPError, ParseError } from '../../src/errors';

beforeEach(() => {
  fetch.resetMocks();
});

describe('use-fetch', () => {
  describe('json', () => {
    it('should parse json', async () => {
      fetch.mockResponse('{"success":"ok"}', { status: 200, url: 'http://jsalterego.im/' });

      const [error, response] = await to(usefetch('http://jsalterego.im/', { json: true, retry: 0 }));

      expect(error).toBe(null);
      expect(response.body).toEqual({ success: 'ok' });
    });

    it('should throw ParseError', async () => {
      fetch.mockResponse('ok', { status: 200, statusText: 'ok', url: 'http://jsalterego.im/' });

      const [error] = await to(usefetch('http://jsalterego.im/', { json: true, retry: 0 }));

      expect(error).toBeInstanceOf(ParseError);
      expect(error).toEqual(expect.objectContaining({
        status: 200,
        statusText: 'ok',
        url: 'http://jsalterego.im/',
      }));
    });
  });

  describe('retry', () => {
    it('skip retries', async () => {
      fetch.mockResponse('{"success":"ok"}', { status: 500, url: 'http://jsalterego.im/' });

      await to(usefetch('http://jsalterego.im/', { json: true, retry: 0 }));

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('retry after particular status ', async () => {
      fetch.mockResponse('{"success":"ok"}', { status: 500, url: 'http://jsalterego.im/' });

      await to(usefetch('http://jsalterego.im/', { json: true, retry: 1 }));

      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('throwHttpErrors', () => {
    it('should throw HTTPError', async () => {
      fetch.mockResponse('{"success":"no"}', {
        status: 500,
        statusText: 'internal server error',
        url: 'http://jsalterego.im/',
      });

      const [error] = await to(usefetch('http://jsalterego.im/', { json: true, retry: 0 }));

      expect(error).toBeInstanceOf(HTTPError);
      expect(error).toEqual(expect.objectContaining({
        status: 500,
        statusText: 'internal server error',
        url: 'http://jsalterego.im/',
      }));
    });

    it('should return response', async () => {
      fetch.mockResponse('{"success":"no"}', { status: 500, url: 'http://jsalterego.im/' });

      const [error, response] = await to(usefetch('http://jsalterego.im/', { json: true, retry: 0, throwHttpErrors: false }));

      expect(error).toBe(null);
      expect(response.body).toEqual({ success: 'no' });
    });
  });
});
