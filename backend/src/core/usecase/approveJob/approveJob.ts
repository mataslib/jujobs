import {jobRepository} from '../../data/repository/jobRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {ApproveJobInput, approveJobInputSchema} from './schema';

export class ApproveJob {
  private deps;
  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'approveJob'>}) {
    this.deps = deps;
  }

  public async execute(input: ApproveJobInput) {
    const validatedInput = approveJobInputSchema.parse(input);
    const {jobId} = validatedInput;

    if (!this.deps.authorizer.approveJob()) {
      throw new AuthorizationError();
    }

    const job = await jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundError();
    }

    job.approve();
    await jobRepository.save(job);
  }
}
