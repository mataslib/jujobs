import {Request, Response} from 'express';
import {
  RequestEmailChangeRequestBody,
  RequestEmailChangeResultBody,
} from 'shared/src/endpoint/requestEmailChange';
import type {} from 'zod';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {MailSender} from '../../core/service/mailSender';
import {mongoClient} from '../../core/service/mongoClient';
import {RequestEmailChange} from '../../core/usecase/requestEmailChange/requestEmailChange';

export const requestEmailChangeHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as RequestEmailChangeRequestBody;

  const messageRepository = new MessageRepository(mongoClient);
  const mailsender = new MailSender({messageRepository});

  const requestEmailChange = new RequestEmailChange({
    mailsender,
    authorizer: req.authorizerOfUser,
  });

  const result = await requestEmailChange.execute(body);

  const responseBody: RequestEmailChangeResultBody = result;
  res.status(200).send(responseBody);
};
