import {APIGatewayProxyEventV2} from 'aws-lambda';
import {TokenRepository} from '../../core/data/repository/tokenRepository';
import {UserRepository} from '../../core/data/repository/userRepository';
import {ExtractResultDto, ExtractErrorDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {Authenticate} from '../../core/usecase/authenticate/authenticate';
import {AuthenticateInput} from '../../core/usecase/authenticate/schema';
import {
  WithAuthenticatedUserPayload,
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (event: APIGatewayProxyEventV2) => {
  const body = event.body ? JSON.parse(event.body) : undefined;

  const authenticate = new Authenticate({
    tokenRepository: new TokenRepository(client),
    userRepository: new UserRepository(client),
  });
  const resultDto = await authenticate.execute(body);

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type AuthenticateRequestPayload = AuthenticateInput;
export type AuthenticateResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type AuthenticateResultPayload =
  ExtractResultDto<AuthenticateResponsePayload>;
export type AuthenticateErrorPayload =
  ExtractErrorDto<AuthenticateResponsePayload>;
