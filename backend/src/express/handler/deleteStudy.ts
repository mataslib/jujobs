import {Request, Response} from 'express';
import {
  DeleteStudyRequestBody,
  DeleteStudyResultBody,
} from 'shared/src/endpoint/deleteStudy';
import type {} from 'zod';
import {DeleteStudy} from '../../core/usecase/deleteStudy/deleteStudy';

export const deleteStudyHandler = async (req: Request, res: Response) => {
  const body = req.body as DeleteStudyRequestBody;

  const deleteStudy = new DeleteStudy({
    authorizer: req.authorizerOfUser,
  });

  const result = await deleteStudy.execute({
    ...body,
  });

  res.status(200).send(result as DeleteStudyResultBody);
};
