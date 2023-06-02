import {Request, Response} from 'express';
import {
  ListJobsRequestQuery,
  ListJobsResultBody,
} from 'shared/src/endpoint/listJobs';
import type {} from 'zod';
import {ListJobs} from '../../core/usecase/listJobs/listJobs';

export const listJobsHandler = async (req: Request, res: Response) => {
  const listJobs = new ListJobs();
  const result = await listJobs.execute(req.query as ListJobsRequestQuery);

  res.status(200).send(result as ListJobsResultBody);
};
