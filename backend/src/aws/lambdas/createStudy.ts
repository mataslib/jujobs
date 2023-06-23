import {APIGatewayProxyEventV2} from 'aws-lambda';
import {StudentRepository} from '../../core/data/repository/studentRepository';
import {CreateStudy} from '../../core/usecase/createStudy/createStudy';
import {CreateStudyInput} from '../../core/usecase/createStudy/schema';
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
  ) as CreateStudyRequestPayload;
  const studentRepository = new StudentRepository(client);

  const createStudy = new CreateStudy({
    authorizer: myContext.authorizerOfUser,
    studentRepository,
  });

  // const presenter = new CreateStudyPresenter();
  const resultDto = await createStudy.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type CreateStudyRequestPayload = CreateStudyInput;

export type CreateStudyResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type CreateStudyResultPayload =
  ExtractResultDto<CreateStudyResponsePayload>;
export type CreateStudyErrorPayload =
  ExtractErrorDto<CreateStudyResponsePayload>;
