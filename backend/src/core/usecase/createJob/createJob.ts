import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {jobRepository} from '../../data/repository/jobRepository';
import {Job} from '../../domain/job/job';
import {TokenUser} from '../../domain/tokenUser/tokenUser';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {CreateJobInput, createJobInputSchema} from './schema';

export class CreateJob {
  private deps;
  constructor(deps: {
    currentUser: TokenUser;
    authorizer: Pick<IAuthorizerOfUser, 'createJob'>;
  }) {
    this.deps = deps;
  }
  public async execute(input: CreateJobInput) {
    const validatedInput = createJobInputSchema.parse(input);

    const {advertiserId, ...createJobParams} = validatedInput;

    if (
      !this.deps.authorizer.createJob({
        advertiserId: validatedInput.advertiserId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const advertiser = await advertiserRepository.findOneById(advertiserId);
    if (!advertiser) {
      throw new NotFoundError();
    }

    const job = Job.create(createJobParams, advertiser, this.deps.currentUser);
    await jobRepository.save(job);

    if (!job.approved) {
      // todo: sendMail
      // await this.sendMail();
    }

    return {
      jobId: job._id.toString(),
    };
  }
}
