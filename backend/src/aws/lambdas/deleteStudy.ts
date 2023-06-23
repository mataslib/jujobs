import {APIGatewayProxyEventV2} from 'aws-lambda';
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
import {DeleteStudy} from '../../core/usecase/deleteStudy/deleteStudy';
import {DeleteStudyInput} from '../../core/usecase/deleteStudy/schema';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {StudentRepository} from '../../core/data/repository/studentRepository';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as DeleteStudyRequestPayload;
  // const advertiserRepository = new AdvertiserRepository(client);
  const studentRepository = new StudentRepository(client);

  const deleteStudy = new DeleteStudy({
    authorizer: myContext.authorizerOfUser,
    studentRepository,
  });

  const resultDto = await deleteStudy.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type DeleteStudyRequestPayload = DeleteStudyInput;

export type DeleteStudyResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type DeleteStudyResultPayload =
  ExtractResultDto<DeleteStudyResponsePayload>;
export type DeleteStudyErrorPayload =
  ExtractErrorDto<DeleteStudyResponsePayload>;
