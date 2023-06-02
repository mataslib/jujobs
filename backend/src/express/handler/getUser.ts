import {Request, Response} from 'express';
import {GetUserResultBody} from 'shared/src/endpoint/getUser';
import {GetUser} from '../../core/usecase/getUser/getUser';

export const getUserHandler = async (req: Request, res: Response) => {
  const {userId} = req.params;

  const getUser = new GetUser({
    authorizer: req.authorizerOfUser,
  });

  const result = await getUser.execute({
    userId: userId,
  });

  const resBody: GetUserResultBody = result;
  res.status(200).send(resBody);
};
