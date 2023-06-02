import {userRepository} from '../../data/repository/userRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {
  UnsubscribeFromNewJobNotificationInput,
  unsubscribeFromNewJobNotificationInputSchema,
} from './schema';

export class UnsubscribeFromNewJobNotification {
  private deps;

  constructor(deps: {
    authorizer: Pick<IAuthorizerOfUser, 'unsubscribeFromNewJobNotification'>;
  }) {
    this.deps = deps;
  }
  async execute(input: UnsubscribeFromNewJobNotificationInput) {
    const validatedInput =
      unsubscribeFromNewJobNotificationInputSchema.parse(input);

    if (
      !this.deps.authorizer.unsubscribeFromNewJobNotification({
        userId: validatedInput.userId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const user = await userRepository.findOneById(validatedInput.userId);
    if (!user) {
      throw new NotFoundError();
    }

    user.update({
      newJobNotificationSubscription: null,
    });
    await userRepository.save(user);
  }
}
