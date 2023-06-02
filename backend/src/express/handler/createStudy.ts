import {Request, Response} from 'express';
import {
  CreateStudyRequestBody,
  CreateStudyResultBody,
} from 'shared/src/endpoint/createStudy';
import type {} from 'zod';
import {CreateStudy} from '../../core/usecase/createStudy/createStudy';

export const createStudyHandler = async (req: Request, res: Response) => {
  const body = req.body as CreateStudyRequestBody;

  const createStudy = new CreateStudy({
    authorizer: req.authorizerOfUser,
  });

  // const presenter = new CreateStudyPresenter();
  const result = await createStudy.execute({
    ...body,
  });

  res.status(201).send(result as CreateStudyResultBody);
};
