import {APIGatewayProxyEventV2} from 'aws-lambda';
import {JobRepository} from '../../core/data/repository/jobRepository';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {AwsSesMailSender} from '../../core/service/mailSender';
import {ExtractErrorDto, ExtractResultDto} from '../../core/shared/dto';
import {UnPromisify} from '../../core/shared/typeUtils';
import {ReplyToJob} from '../../core/usecase/replyToJob/replyToJob';
import {ReplyToJobInput} from '../../core/usecase/replyToJob/schema';
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

export const innerHandler = async (
  event: APIGatewayProxyEventV2,
  _context: any,
  _callback: any,
  myContext: ContextAuthenticatedUser
) => {
  const body = event.body ? JSON.parse(event.body) : undefined;

  const messageRepository = new MessageRepository(client);
  const mailSender = new AwsSesMailSender({
    messageRepository,
  });
  // const advertiser = new ReplyToJob(advertiserRepository);
  const replyToJob = new ReplyToJob({
    mailSender,
    authorizer: myContext.authorizerOfUser,
    currentUser: myContext.user,
    jobRepository: new JobRepository(client),
  });

  const resultDto = await replyToJob.execute(body);
  return dtoToResponse(resultDto);
};

export const handler = withMiddleware(withAuthenticatedUser(innerHandler));

export type ReplyToJobRequestPayload = ReplyToJobInput;

export type ReplyToJobResponsePayload = WithMiddlewarePayload<
  WithAuthenticatedUserPayload<
    UnPromisify<ReturnType<typeof innerHandler>>['typeInferableBody']
  >
>;
export type ReplyToJobResultPayload =
  ExtractResultDto<ReplyToJobResponsePayload>;
export type ReplyToJobErrorPayload = ExtractErrorDto<ReplyToJobResponsePayload>;
