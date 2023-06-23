import {APIGatewayProxyEventV2} from 'aws-lambda';
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {GetAdvertiserView} from '../../core/usecase/getAdvertiserView/getAdvertiserVIew';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (event: APIGatewayProxyEventV2) => {
  // const search = queryParams(event);
  const {advertiserId} = event.pathParameters;

  const getAdvertiserView = new GetAdvertiserView({
    advertiserRepository: new AdvertiserRepository(client),
  });

  const result = await getAdvertiserView.execute({
    advertiserId: advertiserId,
  });

  return dtoToResponse(result);
};

export const handler = withMiddleware(innerHandler);

export type GetAdvertiserViewResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type GetAdvertiserViewResultPayload =
  ExtractResultDto<GetAdvertiserViewResponsePayload>;
export type GetAdvertiserViewErrorPayload =
  ExtractErrorDto<GetAdvertiserViewResponsePayload>;
