import {APIGatewayProxyEventV2} from 'aws-lambda';
import {AdvertiserRegistrationRepository} from '../../core/data/repository/advertiserRegistrationRepository';
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {UserRepository} from '../../core/data/repository/userRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {VerifyAdvertiserInput} from '../../core/usecase/verifyAdvertiser/schema';
import {VerifyAdvertiser} from '../../core/usecase/verifyAdvertiser/verifyAdvertiser';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

export const innerHandler = async (event: APIGatewayProxyEventV2) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as VerifyAdvertiserRequestPayload;

  const verifyAdvertiser = new VerifyAdvertiser({
    advertiserRegistrationRepository: new AdvertiserRegistrationRepository(
      client
    ),
    userRepository: new UserRepository(client),
    client: client,
    advertiserRepository: new AdvertiserRepository(client),
  });

  const resultDto = await verifyAdvertiser.execute(body);

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type VerifyAdvertiserRequestPayload = VerifyAdvertiserInput;

export type VerifyAdvertiserResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;

export type VerifyAdvertiserResultPayload =
  ExtractResultDto<VerifyAdvertiserResponsePayload>;
export type VerifyAdvertiserErrorPayload =
  ExtractErrorDto<VerifyAdvertiserResponsePayload>;
