import {APIGatewayProxyEventV2} from 'aws-lambda';
import {AdvertiserRepository} from '../../core/data/repository/advertiserRepository';
import {S3FileUploader} from '../../core/service/fileUploader';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {UpdateAdvertiserProfileInput} from '../../core/usecase/updateAdvertiserProfile/schema';
import {UpdateAdvertiserProfile} from '../../core/usecase/updateAdvertiserProfile/updateAdvertiserProfile';
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
  // todo: check if current user is allowed to update this advertiser

  const updateAdvertiserProfile = new UpdateAdvertiserProfile({
    fileUploader: new S3FileUploader(),
    advertiserRepository: new AdvertiserRepository(client),
    authorizer: myContext.authorizerOfUser,
  });

  const resultDto = await updateAdvertiserProfile.execute({
    ...body,
  });

  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type UpdateAdvertiserProfileRequestPayload =
  UpdateAdvertiserProfileInput;

export type UpdateAdvertiserProfileResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type UpdateAdvertiserProfileResultPayload =
  ExtractResultDto<UpdateAdvertiserProfileResponsePayload>;
export type UpdateAdvertiserProfileErrorPayload =
  ExtractErrorDto<UpdateAdvertiserProfileResponsePayload>;
