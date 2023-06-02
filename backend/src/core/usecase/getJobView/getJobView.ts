import {jobRepository} from '../../data/repository/jobRepository';
import {jobMapper} from '../../mapper/jobMapper';
import {NotFoundError} from '../../shared/error';
import {GetJobInput, getJobInputSchema} from './schema';

export class GetJobView {
  public async execute(input: GetJobInput) {
    const validatedInput = getJobInputSchema.parse(input);

    const job = await jobRepository.findOneById(validatedInput.jobId);
    if (job === null) {
      throw new NotFoundError();
    }

    return jobMapper.domainToApi(job);
  }
}
