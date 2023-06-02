import {userRepository} from '../../data/repository/userRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {
  SubscribeToNewJobNotificationInput,
  subscribeToNewJobNotificationInputSchema,
} from './schema';

export class SubscribeToNewJobNotification {
  private deps;

  constructor(deps: {
    authorizer: Pick<IAuthorizerOfUser, 'subscribeToNewJobNotification'>;
  }) {
    this.deps = deps;
  }
  async execute(input: SubscribeToNewJobNotificationInput) {
    const validatedInput =
      subscribeToNewJobNotificationInputSchema.parse(input);

    if (
      !this.deps.authorizer.subscribeToNewJobNotification({
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
      newJobNotificationSubscription: {
        filter: validatedInput.filter,
      },
    });

    userRepository.save(user);
  }
}
