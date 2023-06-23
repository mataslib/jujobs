import {APIGatewayProxyEventV2} from 'aws-lambda';
import {RequestEmailChange} from '../../core/usecase/requestEmailChange/requestEmailChange';
import {RequestEmailChangeInput} from '../../core/usecase/requestEmailChange/schema';
import {
  ContextAuthenticatedUser,
  withAuthenticatedUser,
  WithAuthenticatedUserPayload,
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

import type {} from 'zod';
import {EmailChangeRequestRepository} from '../../core/data/repository/emailChangeRequestRepository';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {AwsSesMailSender} from '../../core/service/mailSender';
import {UnPromisify} from '../../core/shared/typeUtils';
import {ExtractResultDto, ExtractErrorDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as RequestEmailChangeRequestPayload;

  const messageRepository = new MessageRepository(client);
  const mailsender = new AwsSesMailSender({messageRepository});
  const emailChangeRequestRepository = new EmailChangeRequestRepository(client);

  const requestEmailChange = new RequestEmailChange({
    emailChangeRequestRepository,
    mailsender,
    authorizer: myContext.authorizerOfUser,
  });

  const resultDto = await requestEmailChange.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type RequestEmailChangeRequestPayload = RequestEmailChangeInput;

export type RequestEmailChangeResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;

export type RequestEmailChangeResultPayload =
  ExtractResultDto<RequestEmailChangeResponsePayload>;
export type RequestEmailChangeErrorPayload =
  ExtractErrorDto<RequestEmailChangeResponsePayload>;
