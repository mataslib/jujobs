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
import {StudentRepository} from '../../core/data/repository/studentRepository';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {ImportStagStudyInput} from '../../core/usecase/importStagStudy/schema';
import {ImportStagStudy} from '../../core/usecase/importStagStudy/importStagStudy';

const client = new MongoClientFactory().createConnectedClient();

const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = (
    event.body ? JSON.parse(event.body) : {}
  ) as ImportStagStudyRequestPayload;
  const studentRepository = new StudentRepository(client);

  const importStagStudy = new ImportStagStudy({
    currentUser: myContext.user,
    studentRepository,
  });

  const resultDto = await importStagStudy.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type ImportStagStudyRequestPayload = ImportStagStudyInput;

export type ImportStagStudyResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type ImportStagStudyResultPayload =
  ExtractResultDto<ImportStagStudyResponsePayload>;
export type ImportStagStudyErrorPayload =
  ExtractErrorDto<ImportStagStudyResponsePayload>;
