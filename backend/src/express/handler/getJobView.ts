import {Request, Response} from 'express';
import {GetJobViewResultBody} from 'shared/src/endpoint/getJobView';
import {GetJobView} from '../../core/usecase/getJobView/getJobView';
export const getJobViewHandler = async (req: Request, res: Response) => {
  const {jobId} = req.params;

  const getJobView = new GetJobView();
  const result = await getJobView.execute({
    jobId: jobId,
  });

  res.status(200).send(result as GetJobViewResultBody);
};
