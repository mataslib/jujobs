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
import {ApproveJob} from '../../core/usecase/approveJob/approveJob';
import {ApproveJobInput} from '../../core/usecase/approveJob/schema';
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
  ) as ApproveJobRequestPayload;
  const jobRepository = new JobRepository(client);

  const approveJob = new ApproveJob({
    authorizer: myContext.authorizerOfUser,
    jobRepository,
  });

  const resultDto = await approveJob.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type ApproveJobRequestPayload = ApproveJobInput;

export type ApproveJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type ApproveJobResultPayload =
  ExtractResultDto<ApproveJobResponsePayload>;
export type ApproveJobErrorPayload = ExtractErrorDto<ApproveJobResponsePayload>;
