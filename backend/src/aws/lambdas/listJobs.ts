import {APIGatewayProxyEventV2} from 'aws-lambda';
import {JobRepository} from '../../core/data/repository/jobRepository';
import {ListJobs, ListJobsInput} from '../../core/usecase/listJobs/listJobs';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

import {UnPromisify} from '../../core/shared/typeUtils';
import type {} from 'zod';
import {queryParams} from './util/queryParams';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  _myContext: any
) => {
  const search = queryParams(event);

  const jobRepository = new JobRepository(client);
  const listJobs = new ListJobs({jobRepository});
  const result = await listJobs.execute(search ? search : {});

  return dtoToResponse(result);
};

export const handler = withMiddleware(innerHandler);

export type ListJobsRequestPayload = ListJobsInput;

export type ListJobsResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type ListJobsResultPayload = ExtractResultDto<ListJobsResponsePayload>;
export type ListJobsErrorPayload = ExtractErrorDto<ListJobsResponsePayload>;
