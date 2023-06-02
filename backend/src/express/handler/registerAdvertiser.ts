import { Request, Response } from 'express';
import {
  RegisterAdvertiserRequestBody,
  RegisterAdvertiserResultBody
} from 'shared/src/endpoint/registerAdvertiser';
import { MessageRepository } from '../../core/data/repository/messageRepository';
import { MailSender } from '../../core/service/mailSender';
import { mongoClient } from '../../core/service/mongoClient';
import { RegisterAdvertiser } from '../../core/usecase/registerAdvertiser/registerAdvertiser';

export const registerAdvertiserHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as RegisterAdvertiserRequestBody;

  // const advertiser = new RegisterAdvertiser(advertiserRepository);
  const registerAdvertiser = new RegisterAdvertiser(
    mailSender: new MailSender({
      messageRepository: new MessageRepository(mongoClient),
    }),
  );

  const result = await registerAdvertiser.execute(body);

  res.status(200).send(result as RegisterAdvertiserResultBody);
};
