import {NewJobNotificationConfigRepository} from '../../data/repository/newJobNotificationConfigRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError} from '../../shared/error';
import {
  GetNewJobNotificationConfigInput,
  getNewJobNotificationConfigInputSchema,
} from './schema';

export class GetNewJobNotificationConfig {
  private deps;

  constructor(deps: {
    newJobNotificationConfigRepository: NewJobNotificationConfigRepository;
    authorizer: Pick<IAuthorizerOfUser, 'getNewJobNotificationConfig'>;
  }) {
    this.deps = deps;
  }
  async execute(input: GetNewJobNotificationConfigInput) {
    const validatedInput = getNewJobNotificationConfigInputSchema.parse(input);

    if (
      !this.deps.authorizer.getNewJobNotificationConfig({
        userId: validatedInput.userId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }
    // 404 if user not exist
    // since user is always token user now, we don't need to check if user exist

    const newJobNotificationConfigView =
      await this.deps.newJobNotificationConfigRepository.getNewJobNotificationConfigView(
        validatedInput.userId
      );

    if (!newJobNotificationConfigView) return null;

    return newJobNotificationConfigView;
  }
}
