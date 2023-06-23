import {APIGatewayProxyEvent, APIGatewayProxyEventV2} from 'aws-lambda';
import queryStringLib from 'query-string';

export function parseParamValue(value: string) {
  const {transform} = queryStringLib.parse(`transform=${value}`, {
    parseBooleans: true,
    parseNumbers: true,
  });

  return transform;
}

export function queryParams(event: APIGatewayProxyEventV2) {
  return queryStringLib.parse(event.rawQueryString, {
    arrayFormat: 'bracket',
    parseBooleans: true,
    parseNumbers: true,
  });
}