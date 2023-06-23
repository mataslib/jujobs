import {APIGatewayProxyEventV2} from 'aws-lambda';
import {StudentRepository} from '../../core/data/repository/studentRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {GetStudent} from '../../core/usecase/getStudent/getStudent';
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
  // const search = queryParams(event);
  const {studentId} = event.pathParameters;

  const getStudent = new GetStudent({
    studentRepository: new StudentRepository(client),
    authorizer: myContext.authorizerOfUser,
  });

  const result = await getStudent.execute({
    studentId: studentId,
  });

  return dtoToResponse(result);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type GetStudentResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type GetStudentResultPayload =
  ExtractResultDto<GetStudentResponsePayload>;
export type GetStudentErrorPayload = ExtractErrorDto<GetStudentResponsePayload>;
