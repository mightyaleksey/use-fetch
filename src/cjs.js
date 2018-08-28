import fetch, { createFetch } from './use-fetch';
import { HTTPError, ParseError, TimeoutError } from './errors';

fetch.HTTPError = HTTPError;
fetch.ParseError = ParseError;
fetch.TimeoutError = TimeoutError;
fetch.createFetch = createFetch;

export default fetch;
