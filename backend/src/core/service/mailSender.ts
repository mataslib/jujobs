import {ObjectId} from 'mongodb';
import {createTransport, getTestMessageUrl} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {MessageRepository} from '../data/repository/messageRepository';
import {Message} from '../domain/message/message';

export interface IMailSender {
  sendMail(mailOptions: Omit<Mail.Options, 'from'>): Promise<{
    messageId: string;
  }>;
}

export class MailSender implements IMailSender {
  private deps;
  constructor(deps: {messageRepository: MessageRepository}) {
    this.deps = deps;
  }

  public async sendMail(mailOptions: Omit<Mail.Options, 'from'>) {
    console.log(`creating email transport`);

    const transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: 'develtestbot@gmail.com',
        pass: 'Parasail8-Symphonic-Brunt',
      },
    });
    console.log(`sending email`);

    const myMailOptions = {
      ...mailOptions,
      from: 'develtestbot@gmail.com', // sender address
      // html: '<b>Hello world?</b>', // html body
    };
    const message = Message.create({
      _id: new ObjectId(myMailOptions.messageId),
      ...myMailOptions,
    });
    await this.deps.messageRepository.save(message);

    // send mail with defined transport object
    const info = await transporter.sendMail(myMailOptions);

    message.sentInfo(info);
    await this.deps.messageRepository.save(message);

    console.log(`email should be successfuly sent to ${myMailOptions.to}`);
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // info.accepted is an array returned by SMTP transports (includes recipient addresses that were accepted by the server)
    // info.rejected is an array returned by SMTP transports (includes recipient addresses that were rejected by the server)
    // info.pending is an array returned by Direct SMTP transport. Includes recipient addresses that were temporarily rejected together with the server response
    console.log(`message info`, JSON.stringify(info));
    // assert length of accepted == 1?

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..

    return {
      messageId: info.messageId,
    };
  }
}
