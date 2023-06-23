import {APIGatewayProxyEventV2} from 'aws-lambda';
import {JobRepository} from '../../core/data/repository/jobRepository';
import {CreateJob} from '../../core/usecase/createJob/createJob';
import {CreateJobInput} from '../../core/usecase/createJob/schema';
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
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {UnPromisify} from '../../core/shared/typeUtils';
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
  ) as CreateJobRequestPayload;
  const advertiserRepository = new AdvertiserRepository(client);
  const jobRepository = new JobRepository(client);

  const createJob = new CreateJob({
    currentUser: myContext.user,
    authorizer: myContext.authorizerOfUser,
    jobRepository,
    advertiserRepository,
  });

  // const presenter = new CreateJobPresenter();
  const resultDto = await createJob.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type CreateJobRequestPayload = CreateJobInput;

export type CreateJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type CreateJobResultPayload = ExtractResultDto<CreateJobResponsePayload>;
export type CreateJobErrorPayload = ExtractErrorDto<CreateJobResponsePayload>;
