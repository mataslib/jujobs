import {APIGatewayProxyEventV2} from 'aws-lambda';
import {StudentRepository} from '../../core/data/repository/studentRepository';
import {UpdateStudy} from '../../core/usecase/updateStudy/updateStudy';
import {UpdateStudyInput} from '../../core/usecase/updateStudy/schema';
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
  ) as UpdateStudyRequestPayload;
  const studentRepository = new StudentRepository(client);

  const updateStudy = new UpdateStudy({
    authorizer: myContext.authorizerOfUser,
    studentRepository,
  });

  // const presenter = new UpdateStudyPresenter();
  const resultDto = await updateStudy.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type UpdateStudyRequestPayload = UpdateStudyInput;

export type UpdateStudyResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type UpdateStudyResultPayload =
  ExtractResultDto<UpdateStudyResponsePayload>;
export type UpdateStudyErrorPayload =
  ExtractErrorDto<UpdateStudyResponsePayload>;
