import {APIGatewayProxyEventV2} from 'aws-lambda';
import {UserRepository} from '../../core/data/repository/userRepository';
import {ResetForgottenPassword} from '../../core/usecase/resetForgottenPassword/resetForgottenPassword';
import {ResetForgottenPasswordInput} from '../../core/usecase/resetForgottenPassword/schema';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

import type {} from 'zod';
import {ForgottenPasswordRequestRepository} from '../../core/data/repository/forgottenPasswordRequestRepository';
import {UnPromisify} from '../../core/shared/typeUtils';
import {ExtractResultDto, ExtractErrorDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (event: APIGatewayProxyEventV2) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as ResetForgottenPasswordRequestPayload;

  const userRepository = new UserRepository(client);
  const forgottenPasswordRequestRepository =
    new ForgottenPasswordRequestRepository(client);

  const resetForgottenPassword = new ResetForgottenPassword({
    forgottenPasswordRequestRepository,
    userRepository,
  });

  const resultDto = await resetForgottenPassword.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type ResetForgottenPasswordRequestPayload = ResetForgottenPasswordInput;

export type ResetForgottenPasswordResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type ResetForgottenPasswordResultPayload =
  ExtractResultDto<ResetForgottenPasswordResponsePayload>;
export type ResetForgottenPasswordErrorPayload =
  ExtractErrorDto<ResetForgottenPasswordResponsePayload>;
