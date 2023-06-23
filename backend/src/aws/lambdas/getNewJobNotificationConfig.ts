import {APIGatewayProxyEventV2} from 'aws-lambda';
import {NewJobNotificationConfigRepository} from '../../core/data/repository/newJobNotificationConfigRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {GetNewJobNotificationConfig} from '../../core/usecase/getNewJobNotificationConfig/getNewJobNotificationConfig';
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
  const {userId} = event.pathParameters;

  const getNewJobNotificationConfig = new GetNewJobNotificationConfig({
    newJobNotificationConfigRepository: new NewJobNotificationConfigRepository(
      client
    ),
    authorizer: myContext.authorizerOfUser,
  });
  const result = await getNewJobNotificationConfig.execute({userId});

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type GetNewJobNotificationConfigResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type GetNewJobNotificationConfigResultPayload =
  ExtractResultDto<GetNewJobNotificationConfigResponsePayload>;

export type GetNewJobNotificationConfigErrorPayload =
  ExtractErrorDto<GetNewJobNotificationConfigResponsePayload>;
