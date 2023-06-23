import {APIGatewayProxyEventV2} from 'aws-lambda';
// import { AdvertiserRepository } from "../../core/data/repository/advertiserRepository";
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {
  ListAdvertisers,
  ListAdvertisersInput,
} from '../../core/usecase/listAdvertisers/listAdvertisers';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

import {UnPromisify} from '../../core/shared/typeUtils';
import type {} from 'zod';
import {queryParams} from './util/queryParams';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  _myContext: any
) => {
  const search = queryParams(event);

  const advertiserRepository = new AdvertiserRepository(client);
  const listAdvertisers = new ListAdvertisers({advertiserRepository});
  const result = await listAdvertisers.execute(search ? search : {});

  return dtoToResponse(result);
};

export const handler = withMiddleware(innerHandler);

export type ListAdvertisersRequestPayload = ListAdvertisersInput;

export type ListAdvertisersResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type ListAdvertisersResultPayload =
  ExtractResultDto<ListAdvertisersResponsePayload>;
export type ListAdvertisersErrorPayload =
  ExtractErrorDto<ListAdvertisersResponsePayload>;
