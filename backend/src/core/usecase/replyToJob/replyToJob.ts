import {jobRepository} from '../../data/repository/jobRepository';
import {TokenUser} from '../../domain/tokenUser/tokenUser';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {IMailSender} from '../../service/mailSender';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {ReplyToJobInput, replyToJobInputSchema} from './schema';

export class ReplyToJob {
  private deps;

  constructor(deps: {
    mailSender: IMailSender;
    authorizer: Pick<IAuthorizerOfUser, 'replyToJob'>;
    currentUser: TokenUser;
  }) {
    this.deps = deps;
  }
  async execute(input: ReplyToJobInput) {
    const validatedInput = replyToJobInputSchema.parse(input);

    if (!this.deps.authorizer.replyToJob()) {
      throw new AuthorizationError();
    }

    // co include studentProfile?
    // - na backend posilat aby byl pridan studentovi do povoleneho senznamu
    // - link pripojim z frontendu? Jinak bych sem musel posilat baseurl student profilu

    const job = await jobRepository.findOneById(validatedInput.jobId);
    if (!job) {
      throw new NotFoundError();
    }

    const sendResult = await this.deps.mailSender.sendMail({
      subject: 'Zájem o pracovní nabídku',
      to: job.replyToEmail,
      replyTo: this.deps.currentUser.getEmail(),
      text: `
        Student Jihočeské univerzity projevil zájem o vaši nabídku.\n
        \n
        Text, motivační dopis studenta:\n
        \n
        ${validatedInput.text}
        `,
    });
  }
}
