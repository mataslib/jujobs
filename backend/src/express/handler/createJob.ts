import {Request, Response} from 'express';
import {
  CreateJobRequestBody,
  CreateJobResultBody,
} from 'shared/src/endpoint/createJob';
import {CreateJob} from '../../core/usecase/createJob/createJob';

export const createJobHandler = async (req: Request, res: Response) => {
  const createJob = new CreateJob({
    currentUser: req.user,
    authorizer: req.authorizerOfUser,
  });

  // const presenter = new CreateJobPresenter();
  const result = await createJob.execute(req.body as CreateJobRequestBody);

  res.status(201).send(result as CreateJobResultBody);
};
