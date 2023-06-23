import {APIGatewayProxyEventV2} from 'aws-lambda';
import {StudentRepository} from '../../core/data/repository/studentRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {UpdateStudentInput} from '../../core/usecase/updateStudent/schema';
import {UpdateStudent} from '../../core/usecase/updateStudent/updateStudent';
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
  const body = event.body ? JSON.parse(event.body) : undefined;
  // todo: check if current user is allowed to update this student

  const updateStudent = new UpdateStudent({
    studentRepository: new StudentRepository(client),
    authorizer: myContext.authorizerOfUser,
  });

  const resultDto = await updateStudent.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type UpdateStudentRequestPayload = UpdateStudentInput;

export type UpdateStudentResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type UpdateStudentResultPayload =
  ExtractResultDto<UpdateStudentResponsePayload>;
export type UpdateStudentErrorPayload =
  ExtractErrorDto<UpdateStudentResponsePayload>;
