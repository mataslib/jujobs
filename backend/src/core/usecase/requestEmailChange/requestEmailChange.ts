import {emailChangeRequestRepository} from '../../data/repository/emailChangeRequestRepository';
import {EmailChangeRequest} from '../../domain/emailChangeRequest/emailChangeRequest';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {IMailSender} from '../../service/mailSender';
import {AuthorizationError} from '../../shared/error';
import {RequestEmailChangeInput, requestEmailChangeInputSchema} from './schema';

export class RequestEmailChange {
  private deps;
  constructor(deps: {
    mailsender: IMailSender;
    authorizer: Pick<IAuthorizerOfUser, 'requestEmailChange'>;
  }) {
    this.deps = deps;
  }
  public async execute(input: RequestEmailChangeInput) {
    const validatedInput = requestEmailChangeInputSchema.parse(input);

    if (
      !this.deps.authorizer.requestEmailChange({
        userId: validatedInput.userId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const emailChangeRequest = EmailChangeRequest.create({
      userId: validatedInput.userId,
      verifyEmailUrl: validatedInput.verifyEmailUrl,
      newEmail: validatedInput.newEmail,
    });

    await emailChangeRequestRepository.save(emailChangeRequest);
    await this.deps.mailsender.sendMail({
      to: validatedInput.newEmail,
      subject: 'Změna emailu',
      text: `Evidujeme žádost o změnu emailu, potvrďtě ji zde: ${emailChangeRequest.verifyEmailUrl}`,
    });

    return {
      requestId: emailChangeRequest._id.toString(),
    };
  }
}
