import { isNil, isString } from 'lodash-es';
import queryString from 'query-string';

function parseObjToQuery(obj = {}, startWith = '?') {
  if (isNil(obj)) return '';
  let keys = Object.keys(obj).filter((key) => !isNil(obj[key]) && !(isString(obj[key]) && obj[key].trim().length === 0));
  let params = {};

  (keys || []).map((key) => (params = { ...params, [key]: obj[key] }));
  return startWith + queryString.stringify(params);
}

export default parseObjToQuery;
