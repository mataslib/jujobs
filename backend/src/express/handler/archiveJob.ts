import {Request, Response} from 'express';
import {
  ArchiveJobRequestBody,
  ArchiveJobResultBody,
} from 'shared/src/endpoint/archiveJob';
import type {} from 'zod';
import {ArchiveJob} from '../../core/usecase/archiveJob/archiveJob';

export const archiveJobHandler = async (req: Request, res: Response) => {
  const archiveJob = new ArchiveJob({
    authorizer: req.authorizerOfUser,
  });

  const result = await archiveJob.execute(req.body as ArchiveJobRequestBody);

  res.status(200).send(result as ArchiveJobResultBody);
};
