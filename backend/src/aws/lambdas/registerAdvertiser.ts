import {APIGatewayProxyEventV2} from 'aws-lambda';
import {AdvertiserRegistrationRepository} from '../../core/data/repository/advertiserRegistrationRepository';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {AwsSesMailSender} from '../../core/service/mailSender';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {RegisterAdvertiser} from '../../core/usecase/registerAdvertiser/registerAdvertiser';
import {RegisterAdvertiserInput} from '../../core/usecase/registerAdvertiser/schema';
import {
  withMiddleware,
  WithMiddlewarePayload,
} from './middleware/withMiddleware';
import {MongoClientFactory} from './util/mongoClientFactory';
import {dtoToResponse} from './util/util';

const client = new MongoClientFactory().createConnectedClient();

export const innerHandler = async (event: APIGatewayProxyEventV2) => {
  console.log(`register advertiser lambda`);
  const body = event.body ? JSON.parse(event.body) : undefined;

  const advertiserRegistrationRepository = new AdvertiserRegistrationRepository(
    client
  );
  const messageRepository = new MessageRepository(client);
  const mailSender = new AwsSesMailSender({
    messageRepository,
  });
  // const advertiser = new RegisterAdvertiser(advertiserRepository);
  const registerAdvertiser = new RegisterAdvertiser({
    advertiserRegistrationRepository,
    mailSender,
  });

  const resultDto = await registerAdvertiser.execute(body);
  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(innerHandler);

export type RegisterAdvertiserRequestPayload = RegisterAdvertiserInput;

export type RegisterAdvertiserResponsePayload = WithMiddlewarePayload<
  UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
>;
export type RegisterAdvertiserResultPayload =
  ExtractResultDto<RegisterAdvertiserResponsePayload>;
export type RegisterAdvertiserErrorPayload =
  ExtractErrorDto<RegisterAdvertiserResponsePayload>;
