import {forgottenPasswordRequestRepository} from '../../data/repository/forgottenPasswordRequestRepository';
import {userRepository} from '../../data/repository/userRepository';
import {ForgottenPasswordRequest} from '../../domain/forgottenPasswordRequest/forgottenPasswordRequest';
import {IMailSender} from '../../service/mailSender';
import {
  forgottenPasswordRequestInputSchema,
  RequestForgottenPasswordInput,
} from './schema';

export class RequestForgottenPassword {
  private deps;
  constructor(deps: {mailsender: IMailSender}) {
    this.deps = deps;
  }
  public async execute(input: RequestForgottenPasswordInput) {
    const validatedInput = forgottenPasswordRequestInputSchema.parse(input);

    const user = await userRepository.findOneByEmail(validatedInput.email);

    if (user === null) {
      // don't reveal that user does not exist
      // - prevent user exploration
      console.log(`user does not exist`);
      return undefined;
    }

    const forgottenPasswordRequest = ForgottenPasswordRequest.create({
      userId: user._id,
      changePasswordUrl: validatedInput.changePasswordUrl,
    });

    await forgottenPasswordRequestRepository.save(forgottenPasswordRequest);

    await this.deps.mailsender.sendMail({
      to: user.email,
      subject: 'Obnova hesla',
      text: `Zapomněli jste heslo? Pokud ano, můžete si ho změnit zde: ${forgottenPasswordRequest.changePasswordUrl}`,
    });

    return {
      requestId: forgottenPasswordRequest._id.toString(),
    };
  }
}
