import {APIGatewayProxyEventV2} from 'aws-lambda';
import {JobRepository} from '../../core/data/repository/jobRepository';
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
import {UnPromisify} from '../../core/shared/typeUtils';
import {UpdateJob} from '../../core/usecase/updateJob/updateJob';
import {UpdateJobInput} from '../../core/usecase/updateJob/schema';
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as UpdateJobRequestPayload;

  const updateJob = new UpdateJob({
    currentUser: myContext.user,
    authorizer: myContext.authorizerOfUser,
    jobRepository: new JobRepository(client),
    advertiserRepository: new AdvertiserRepository(client),
  });

  const resultDto = await updateJob.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type UpdateJobRequestPayload = UpdateJobInput;
export type UpdateJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type UpdateJobResultPayload = ExtractResultDto<UpdateJobResponsePayload>;
export type UpdateJobErrorPayload = ExtractErrorDto<UpdateJobResponsePayload>;
