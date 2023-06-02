import {emailChangeRequestRepository} from '../../data/repository/emailChangeRequestRepository';
import {userRepository} from '../../data/repository/userRepository';
import {NotFoundError} from '../../shared/error';
import {VerifyEmailChangeInput, verifyEmailChangeInputSchema} from './schema';

export class VerifyEmailChange {
  // 1. zvaliduje input
  // 2. najde zadost s odpovidajicim tokenem
  // 3. pozmeni uzivateli email
  // 4. smaze zadost o zmenu emailu
  public async execute(input: VerifyEmailChangeInput) {
    const validatedInput = verifyEmailChangeInputSchema.parse(input);

    const emailChangeRequest =
      await emailChangeRequestRepository.findOneByToken(validatedInput.token);
    if (!emailChangeRequest) {
      throw new NotFoundError(`Email change request not found!`);
    }

    const user = await userRepository.findOneById(emailChangeRequest.userId);
    if (!user) throw new NotFoundError(`User not found!`);

    await user.changeEmail(emailChangeRequest.newEmail);
    await userRepository.save(user);
    await emailChangeRequestRepository.delete(emailChangeRequest);
  }
}
