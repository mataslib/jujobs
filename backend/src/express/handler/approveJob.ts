import {Request, Response} from 'express';
import {
  ApproveJobRequestBody,
  ApproveJobResultBody,
} from 'shared/src/endpoint/approveJob';
import type {} from 'zod';
import {ApproveJob} from '../../core/usecase/approveJob/approveJob';

export const approveJobHandler = async (req: Request, res: Response) => {
  const approveJob = new ApproveJob({
    authorizer: req.authorizerOfUser,
  });

  const result = await approveJob.execute(req.body as ApproveJobRequestBody);

  res.status(200).send(result as ApproveJobResultBody);
};
