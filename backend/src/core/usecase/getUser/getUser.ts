import {userRepository} from '../../data/repository/userRepository';
import { userMapper } from '../../mapper/userMapper';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {GetUserInput, getUserInputSchema} from './schema';

export class GetUser {
  private deps;

  constructor(deps: {authorizer: Pick<IAuthorizerOfUser, 'getUser'>}) {
    this.deps = deps;
  }

  async execute(input: GetUserInput) {
    const validatedInput = getUserInputSchema.parse(input);

    if (
      !this.deps.authorizer.getUser({
        userId: validatedInput.userId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const user = await userRepository.findOneById(validatedInput.userId);
    if (user === null) {
      throw new NotFoundError();
    }

    return userMapper.domainToApi(user);
  }
}
