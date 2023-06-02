import {Request, Response} from 'express';
import {
  UpdateJobRequestBody,
  UpdateJobResultBody,
} from 'shared/src/endpoint/updateJob';
import type {} from 'zod';
import {UpdateJob} from '../../core/usecase/updateJob/updateJob';

export const updateJobHandler = async (req: Request, res: Response) => {
  const body = req.body as UpdateJobRequestBody;

  const updateJob = new UpdateJob({
    currentUser: req.user,
    authorizer: req.authorizerOfUser,
  });

  const result = await updateJob.execute({
    ...body,
  });

  res.status(200).send(result as UpdateJobResultBody);
};
