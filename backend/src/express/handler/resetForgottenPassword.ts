import {Request, Response} from 'express';
import {
  ResetForgottenPasswordRequestBody,
  ResetForgottenPasswordResultBody,
} from 'shared/src/endpoint/resetForgottenPassword';
import type {} from 'zod';
import {ResetForgottenPassword} from '../../core/usecase/resetForgottenPassword/resetForgottenPassword';

export const resetForgottenPasswordHandler = async (
  req: Request,
  res: Response
) => {
  const body = req.body as ResetForgottenPasswordRequestBody;

  const resetForgottenPassword = new ResetForgottenPassword();

  const result = await resetForgottenPassword.execute(body);

  res.status(200).send(result as ResetForgottenPasswordResultBody);
};
