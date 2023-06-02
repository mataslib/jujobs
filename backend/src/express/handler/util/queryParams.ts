import queryStringLib from 'query-string';

export function parseParamValue(value: string) {
  const {transform} = queryStringLib.parse(`transform=${value}`, {
    parseBooleans: true,
    parseNumbers: true,
  });

  return transform;
}

export function parseQueryString(rawQueryString: string) {
  return queryStringLib.parse(rawQueryString, {
    arrayFormat: 'bracket',
    parseBooleans: true,
    parseNumbers: true,
  });
}
