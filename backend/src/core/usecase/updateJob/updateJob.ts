import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {jobRepository} from '../../data/repository/jobRepository';
import {TokenUser} from '../../domain/tokenUser/tokenUser';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {UpdateJobInput, updateJobInputSchema} from './schema';

export class UpdateJob {
  private deps;
  constructor(deps: {
    currentUser: TokenUser;
    authorizer: Pick<IAuthorizerOfUser, 'updateJob'>;
  }) {
    this.deps = deps;
  }

  public async execute(input: UpdateJobInput) {
    const validatedInput = updateJobInputSchema.parse(input);

    const {jobId, ...updateUserInput} = validatedInput;

    const job = await jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundError();
    }

    if (
      !this.deps.authorizer.updateJob({
        advertiserId: job.advertiser._id.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const advertiser = await advertiserRepository.findOneById(
      job.advertiser._id
    );
    if (!advertiser) {
      throw new NotFoundError();
    }

    job.update(updateUserInput, advertiser, this.deps.currentUser);
    await jobRepository.save(job);

    return {
      jobId: job._id.toString(),
    };
  }
}
