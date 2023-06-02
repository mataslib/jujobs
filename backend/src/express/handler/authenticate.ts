import {Request, Response} from 'express';
import {
  AuthenticateRequestBody,
  AuthenticateResultBody,
} from 'shared/src/endpoint/authenticate';
import {Authenticate} from '../../core/usecase/authenticate/authenticate';

export const authenticateHandler = async (req: Request, res: Response) => {
  const authenticate = new Authenticate();

  const result = await authenticate.execute(
    req.body as AuthenticateRequestBody
  );

  res.status(200).send(result as AuthenticateResultBody);
};
