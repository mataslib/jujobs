import {APIGatewayProxyEventV2} from 'aws-lambda';
import {NewJobNotificationConfigRepository} from '../../core/data/repository/newJobNotificationConfigRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {SaveNewJobNotificationConfig} from '../../core/usecase/saveNewJobNotificationConfig/saveNewJobNotificationConfig';
import {SaveNewJobNotificationConfigInput} from '../../core/usecase/saveNewJobNotificationConfig/schema';
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
  ) as SaveNewJobNotificationConfigRequestPayload;

  const saveNewJobNotificationConfig = new SaveNewJobNotificationConfig({
    newJobNotificationConfigRepository: new NewJobNotificationConfigRepository(
      client
    ),
    authorizer: myContext.authorizerOfUser,
  });
  const result = await saveNewJobNotificationConfig.execute(body);

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type SaveNewJobNotificationConfigRequestPayload =
  SaveNewJobNotificationConfigInput;
export type SaveNewJobNotificationConfigResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type SaveNewJobNotificationConfigResultPayload =
  ExtractResultDto<SaveNewJobNotificationConfigResponsePayload>;
export type SaveNewJobNotificationConfigErrorPayload =
  ExtractErrorDto<SaveNewJobNotificationConfigResponsePayload>;
