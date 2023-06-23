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
import {ArchiveJob} from '../../core/usecase/archiveJob/archiveJob';
import {ArchiveJobInput} from '../../core/usecase/archiveJob/schema';
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
  ) as ArchiveJobRequestPayload;
  const jobRepository = new JobRepository(client);

  const archiveJob = new ArchiveJob({
    authorizer: myContext.authorizerOfUser,
    jobRepository,
  });

  const resultDto = await archiveJob.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type ArchiveJobRequestPayload = ArchiveJobInput;
export type ArchiveJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type ArchiveJobResultPayload =
  ExtractResultDto<ArchiveJobResponsePayload>;
export type ArchiveJobErrorPayload = ExtractErrorDto<ArchiveJobResponsePayload>;
