import {jobRepository} from '../../data/repository/jobRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {ArchiveJobInput, archiveJobInputSchema} from './schema';

export class ArchiveJob {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'archiveJob'>}) {
    this.deps = deps;
  }

  public async execute(input: ArchiveJobInput) {
    const validatedInput = archiveJobInputSchema.parse(input);
    const {jobId} = validatedInput;

    const job = await jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundError();
    }

    if (
      !this.deps.authorizer.archiveJob({
        advertiserId: job.advertiser._id.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    job.archive();
    await jobRepository.save(job);
  }
}
