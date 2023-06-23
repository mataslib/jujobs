import {APIGatewayProxyEventV2} from 'aws-lambda';
import {UserJobFilterRepository} from '../../core/data/repository/userJobFilterRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {GetJobFilter} from '../../core/usecase/GetJobFilter/getJobFilter';
import {
  ContextAuthenticatedUser,
  withAuthenticatedUser,
  WithAuthenticatedUserPayload,
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const jobFilterRepository = new UserJobFilterRepository(client);
  const getJobFilter = new GetJobFilter({
    jobFilterRepository: jobFilterRepository,
    currentUser: myContext.user,
  });
  const result = await getJobFilter.execute();

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type GetJobFilterResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type GetJobFilterResultPayload =
  ExtractResultDto<GetJobFilterResponsePayload>;

export type GetJobFilterErrorPayload =
  ExtractErrorDto<GetJobFilterResponsePayload>;
