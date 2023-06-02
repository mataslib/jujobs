import {Request, Response} from 'express';
import {
  VerifyEmailChangeRequestBody,
  VerifyEmailChangeResultBody,
} from 'shared/src/endpoint/verifyEmailChange';
import {VerifyEmailChange} from '../../core/usecase/verifyEmailChange/verifyEmailChange';

export const verifyEmailChangeHandler = async (req: Request, res: Response) => {
  const body = req.body as VerifyEmailChangeRequestBody;

  const verifyEmailChange = new VerifyEmailChange();

  const result = await verifyEmailChange.execute(body);

  res.status(200).send(result as VerifyEmailChangeResultBody);
};
