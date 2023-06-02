import {Request, Response} from 'express';
import {
  ReplyToJobRequestBody,
  ReplyToJobResultBody,
} from 'shared/src/endpoint/replyToJob';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {MailSender} from '../../core/service/mailSender';
import {mongoClient} from '../../core/service/mongoClient';
import {ReplyToJob} from '../../core/usecase/replyToJob/replyToJob';

export const replyToJobHandler = async (req: Request, res: Response) => {
  const body = req.body as ReplyToJobRequestBody;

  const messageRepository = new MessageRepository(mongoClient);
  const mailSender = new MailSender({
    messageRepository,
  });
  // const advertiser = new ReplyToJob(advertiserRepository);
  const replyToJob = new ReplyToJob({
    mailSender,
    authorizer: req.authorizerOfUser,
    currentUser: req.user,
  });

  const result = await replyToJob.execute(body);

  res.status(200).send(result as ReplyToJobResultBody);
};
