import {Request, Response} from 'express';
import {
  DeleteJobRequestBody,
  DeleteJobResultBody,
} from 'shared/src/endpoint/deleteJob';
import type {} from 'zod';
import {DeleteJob} from '../../core/usecase/deleteJob/deleteJob';

export const deleteJobHandler = async (req: Request, res: Response) => {
  const body = req.body as DeleteJobRequestBody;

  const deleteJob = new DeleteJob({
    authorizer: req.authorizerOfUser,
  });

  const result = await deleteJob.execute(body);

  res.status(200).send(result as DeleteJobResultBody);
};
