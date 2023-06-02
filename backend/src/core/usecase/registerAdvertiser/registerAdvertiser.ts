import {advertiserRegistrationRepository} from '../../data/repository/advertiserRegistrationRepository';
import {AdvertiserRegistration} from '../../domain/advertiserRegistration/advertiserRegistration';
import {IMailSender} from '../../service/mailSender';
import {RegisterAdvertiserInput, registerAdvertiserInputSchema} from './schema';

export class RegisterAdvertiser {
  private deps;

  constructor(deps: {mailSender: IMailSender}) {
    this.deps = deps;
  }
  async execute(input: RegisterAdvertiserInput) {
    const validatedInput = registerAdvertiserInputSchema.parse(input);

    const advertiserRegistration = await AdvertiserRegistration.create(
      validatedInput
    );

    await advertiserRegistrationRepository.save(advertiserRegistration);

    await this.sendEmailVerificationEmail(advertiserRegistration);
  }

  private sendEmailVerificationEmail = async (
    advertiserRegistration: AdvertiserRegistration
  ) => {
    return this.deps.mailSender.sendMail({
      subject: 'Ověření registrace', // Subject line
      to: advertiserRegistration.email,
      text: `Děkujeme za registraci. Ověřte svou registrace navštívením této stránky: ${advertiserRegistration.verifyUrl}`,
    });
  };
}
