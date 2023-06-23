import {APIGatewayProxyEventV2} from 'aws-lambda';
import {EmailChangeRequestRepository} from '../../core/data/repository/emailChangeRequestRepository';
import {UserRepository} from '../../core/data/repository/userRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {VerifyEmailChangeInput} from '../../core/usecase/verifyEmailChange/schema';
import {VerifyEmailChange} from '../../core/usecase/verifyEmailChange/verifyEmailChange';
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
  ) as VerifyEmailChangeRequestPayload;

  const verifyEmailChange = new VerifyEmailChange({
    emailChangeRequestRepository: new EmailChangeRequestRepository(client),
    userRepository: new UserRepository(client),
    client: client,
  });

  const resultDto = await verifyEmailChange.execute(body);

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type VerifyEmailChangeRequestPayload = VerifyEmailChangeInput;

export type VerifyEmailChangeResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;

export type VerifyEmailChangeResultPayload =
  ExtractResultDto<VerifyEmailChangeResponsePayload>;
export type VerifyEmailChangeErrorPayload =
  ExtractErrorDto<VerifyEmailChangeResponsePayload>;
