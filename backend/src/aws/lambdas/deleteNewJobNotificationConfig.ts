import {APIGatewayProxyEventV2} from 'aws-lambda';
import {NewJobNotificationConfigRepository} from '../../core/data/repository/newJobNotificationConfigRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {DeleteNewJobNotificationConfig} from '../../core/usecase/deleteNewJobNotificationConfig/deleteNewJobNotificationConfig';
import {DeleteNewJobNotificationConfigInput} from '../../core/usecase/deleteNewJobNotificationConfig/schema';
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
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as DeleteNewJobNotificationConfigRequestPayload;

  const deleteNewJobNotificationConfig = new DeleteNewJobNotificationConfig({
    newJobNotificationConfigRepository: new NewJobNotificationConfigRepository(
      client
    ),
    authorizer: myContext.authorizerOfUser,
  });
  const result = await deleteNewJobNotificationConfig.execute(body);

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type DeleteNewJobNotificationConfigRequestPayload =
  DeleteNewJobNotificationConfigInput;

export type DeleteNewJobNotificationConfigResponsePayload =
  WithMiddlewarePayload<
    WithAuthenticatedUserPayload<
      UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
    >
  >;
export type DeleteNewJobNotificationConfigResultPayload =
  ExtractResultDto<DeleteNewJobNotificationConfigResponsePayload>;

export type DeleteNewJobNotificationConfigErrorPayload =
  ExtractErrorDto<DeleteNewJobNotificationConfigResponsePayload>;
