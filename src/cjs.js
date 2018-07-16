import fetch, {createFetch} from './use-fetch';
import {HTTPError, ParseError} from './errors';

fetch.HTTPError = HTTPError;
fetch.ParseError = ParseError;
fetch.createFetch = createFetch;

export default fetch;
