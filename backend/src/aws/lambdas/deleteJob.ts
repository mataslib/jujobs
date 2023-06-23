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
import {DeleteJob} from '../../core/usecase/deleteJob/deleteJob';
import {DeleteJobInput} from '../../core/usecase/deleteJob/schema';
// import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
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
  ) as DeleteJobRequestPayload;
  // const advertiserRepository = new AdvertiserRepository(client);
  const jobRepository = new JobRepository(client);

  const deleteJob = new DeleteJob({
    jobRepository,
    authorizer: myContext.authorizerOfUser,
  });

  const resultDto = await deleteJob.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type DeleteJobRequestPayload = DeleteJobInput;

export type DeleteJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type DeleteJobResultPayload = ExtractResultDto<DeleteJobResponsePayload>;
export type DeleteJobErrorPayload = ExtractErrorDto<DeleteJobResponsePayload>;
