import {Request, Response} from 'express';
import {
  RequestForgottenPasswordRequestBody,
  RequestForgottenPasswordResultBody,
} from 'shared/src/endpoint/requestForgottenPassword';
import type {} from 'zod';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {MailSender} from '../../core/service/mailSender';
import {mongoClient} from '../../core/service/mongoClient';
import {RequestForgottenPassword} from '../../core/usecase/requestForgottenPassword/requestForgottenPassword';

export const requestForgottenPasswordHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as RequestForgottenPasswordRequestBody;

  const messageRepository = new MessageRepository(mongoClient);
  const mailsender = new MailSender({messageRepository});

  const requestForgottenPassword = new RequestForgottenPassword({
    mailsender,
  });

  const result = await requestForgottenPassword.execute(body);

  res.status(200).send(result as RequestForgottenPasswordResultBody);
};
