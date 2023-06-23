import {APIGatewayProxyEventV2} from 'aws-lambda';
import {JobRepository} from '../../core/data/repository/jobRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {GetJobView} from '../../core/usecase/getJobView/getJobView';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (event: APIGatewayProxyEventV2) => {
  // const search = queryParams(event);
  const {jobId} = event.pathParameters;

  const jobRepository = new JobRepository(client);
  const getJobView = new GetJobView({jobRepository});
  const result = await getJobView.execute({
    jobId: jobId,
  });

  return dtoToResponse(result);
};

export const handler = withMiddleware(innerHandler);

export type GetJobViewResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type GetJobViewResultPayload =
  ExtractResultDto<GetJobViewResponsePayload>;

export type GetJobViewErrorPayload = ExtractErrorDto<GetJobViewResponsePayload>;
