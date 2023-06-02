import {advertiserRegistrationRepository} from '../../data/repository/advertiserRegistrationRepository';
import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {userRepository} from '../../data/repository/userRepository';
import {Advertiser} from '../../domain/advertiser/advertiser';
import {User} from '../../domain/user/user';
import {mongoClient} from '../../service/mongoClient';
import {NotFoundError} from '../../shared/error';
import {VerifyAdvertiserInput, verifyAdvertiserInputSchema} from './schema';

export class VerifyAdvertiser {
  // 1. zvaliduje input
  // 2. najde registraci s odpovidajicim tokenem
  // 3. vytvori uzivatele z registrace
  // 4. smaze registraci
  public async execute(input: VerifyAdvertiserInput) {
    const validatedInput = verifyAdvertiserInputSchema.parse(input);

    const advertiserRegistration =
      await advertiserRegistrationRepository.findOneByToken(
        validatedInput.token
      );
    if (!advertiserRegistration) {
      throw new NotFoundError();
    }
    await mongoClient.withSession(async session => {
      await session.withTransaction(async () => {
        const advertiser = Advertiser.fromAdvertiserRegistration(
          advertiserRegistration
        );
        const user = User.fromAdvertiserRegistration(
          advertiserRegistration,
          advertiser._id
        );
        await userRepository.save(user, session);
        await advertiserRepository.save(advertiser, session);
        await advertiserRegistrationRepository.delete(
          advertiserRegistration,
          session
        );
      });
    });
  }
}
