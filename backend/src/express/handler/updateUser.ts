import {Request, Response} from 'express';
import {
  UpdateUserRequestBody,
  UpdateUserResultBody,
} from 'shared/src/endpoint/updateUser';
import {UpdateUser} from '../../core/usecase/updateUser/updateUser';

export const updateUserHandler = async (req: Request, res: Response) => {
  const body = req.body as UpdateUserRequestBody;

  const updateUser = new UpdateUser({
    authorizer: req.authorizerOfUser,
  });

  const result = await updateUser.execute({
    ...body,
  });

  res.status(200).send(result as UpdateUserResultBody);
};
