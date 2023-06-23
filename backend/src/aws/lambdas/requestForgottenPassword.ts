import {APIGatewayProxyEventV2} from 'aws-lambda';
import {UserRepository} from '../../core/data/repository/userRepository';
import {RequestForgottenPassword} from '../../core/usecase/requestForgottenPassword/requestForgottenPassword';
import {RequestForgottenPasswordInput} from '../../core/usecase/requestForgottenPassword/schema';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

import type {} from 'zod';
import {ForgottenPasswordRequestRepository} from '../../core/data/repository/forgottenPasswordRequestRepository';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {AwsSesMailSender} from '../../core/service/mailSender';
import {UnPromisify} from '../../core/shared/typeUtils';
import {ExtractResultDto, ExtractErrorDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (event: APIGatewayProxyEventV2) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as RequestForgottenPasswordRequestPayload;

  const messageRepository = new MessageRepository(client);
  const mailsender = new AwsSesMailSender({messageRepository});
  const userRepository = new UserRepository(client);
  const forgottenPasswordRequestRepository =
    new ForgottenPasswordRequestRepository(client);

  const requestForgottenPassword = new RequestForgottenPassword({
    forgottenPasswordRequestRepository,
    userRepository,
    mailsender,
  });

  const resultDto = await requestForgottenPassword.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type RequestForgottenPasswordRequestPayload =
  RequestForgottenPasswordInput;

export type RequestForgottenPasswordResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;

export type RequestForgottenPasswordResultPayload =
  ExtractResultDto<RequestForgottenPasswordResponsePayload>;
export type RequestForgottenPasswordErrorPayload =
  ExtractErrorDto<RequestForgottenPasswordResponsePayload>;
  