import {Request, Response} from 'express';
import {
  UpdateStudyRequestBody,
  UpdateStudyResultBody,
} from 'shared/src/endpoint/updateStudy';
import type {} from 'zod';
import {UpdateStudy} from '../../core/usecase/updateStudy/updateStudy';

export const updateStudyHandler = async (req: Request, res: Response) => {
  const body = req.body as UpdateStudyRequestBody;

  const updateStudy = new UpdateStudy({
    authorizer: req.authorizerOfUser,
  });

  // const presenter = new UpdateStudyPresenter();
  const result = await updateStudy.execute({
    ...body,
  });

  res.status(200).send(result as UpdateStudyResultBody);
};
