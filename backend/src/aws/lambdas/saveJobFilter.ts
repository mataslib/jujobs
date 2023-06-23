import {APIGatewayProxyEventV2} from 'aws-lambda';
import {UserJobFilterRepository} from '../../core/data/repository/userJobFilterRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {SaveJobFilter} from '../../core/usecase/saveJobFilter/saveJobFilter';
import {SaveJobFilterInput} from '../../core/usecase/saveJobFilter/schema';
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
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as SaveJobFilterRequestPayload;
  const jobFilterRepository = new UserJobFilterRepository(client);
  const saveJobFilter = new SaveJobFilter({
    jobFilterRepository: jobFilterRepository,
    currentUser: myContext.user,
  });
  const result = await saveJobFilter.execute(body);

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type SaveJobFilterRequestPayload = SaveJobFilterInput;

export type SaveJobFilterResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type SaveJobFilterResultPayload =
  ExtractResultDto<SaveJobFilterResponsePayload>;

export type SaveJobFilterErrorPayload =
  ExtractErrorDto<SaveJobFilterResponsePayload>;
