import {userRepository} from '../../data/repository/userRepository';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {UpdateUserInput, updateUserInputSchema} from './schema';

export class UpdateUser {
  private deps;

  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'updateUser'>}) {
    this.deps = deps;
  }

  // 1. validate input
  // 2. find user
  // 3. update user's user
  //  3.1. if input contains logo, upload logo
  //    3.1.1 if upload fails and logo is only input - return error
  //
  async execute(input: UpdateUserInput) {
    const validatedInput = updateUserInputSchema.parse(input);

    if (
      !this.deps.authorizer.updateUser({
        userId: validatedInput.userId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const user = await userRepository.findOneById(validatedInput.userId);
    if (user === null) {
      throw new NotFoundError();
    }

    await user.update(validatedInput);
    await userRepository.save(user);

    return;
  }
}
