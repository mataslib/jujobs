import {forgottenPasswordRequestRepository} from '../../data/repository/forgottenPasswordRequestRepository';
import {userRepository} from '../../data/repository/userRepository';
import {NotFoundError} from '../../shared/error';
import {
  ResetForgottenPasswordInput,
  resetForgottenPasswordInputSchema,
} from './schema';

export class ResetForgottenPassword {
  public async execute(input: ResetForgottenPasswordInput) {
    const validatedInput = resetForgottenPasswordInputSchema.parse(input);

    const forgottenPasswordRequest =
      await forgottenPasswordRequestRepository.findOneByToken(
        validatedInput.token
      );
    if (!forgottenPasswordRequest) {
      throw new NotFoundError(`Reset password request not found!`);
    }

    const user = await userRepository.findOneById(
      forgottenPasswordRequest.userId
    );
    if (!user) {
      throw new NotFoundError(`User not found!`);
    }

    await user.update({
      password: validatedInput.password,
    });
    await userRepository.save(user);
  }
}
