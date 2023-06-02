import {jobRepository} from '../../data/repository/jobRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {DeleteJobInput, deleteJobInputSchema} from './schema';

export class DeleteJob {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'deleteJob'>}) {
    this.deps = deps;
  }

  public async execute(input: DeleteJobInput) {
    const validatedInput = deleteJobInputSchema.parse(input);

    const {jobId} = validatedInput;

    const job = await jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundError();
    }

    if (
      !this.deps.authorizer.deleteJob({
        advertiserId: job.advertiser._id.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    await jobRepository.delete(job);
  }
}
