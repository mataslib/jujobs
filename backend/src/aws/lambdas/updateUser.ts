import {APIGatewayProxyEventV2} from 'aws-lambda';
import {UserRepository} from '../../core/data/repository/userRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {UpdateUserInput} from '../../core/usecase/updateUser/schema';
import {UpdateUser} from '../../core/usecase/updateUser/updateUser';
import {
  ContextAuthenticatedUser,
  withAuthenticatedUser,
  WithAuthenticatedUserPayload,
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = event.body ? JSON.parse(event.body) : undefined;

  const updateUser = new UpdateUser({
    // currentUser:
    userRepository: new UserRepository(client),
    authorizer: myContext.authorizerOfUser,
  });

  const resultDto = await updateUser.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type UpdateUserRequestPayload = UpdateUserInput;

export type UpdateUserResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type UpdateUserResultPayload =
  ExtractResultDto<UpdateUserResponsePayload>;
export type UpdateUserErrorPayload = ExtractErrorDto<UpdateUserResponsePayload>;
