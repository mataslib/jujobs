import {SESMessage, SNSEvent} from 'aws-lambda';
import {MessageRepository} from '../../core/data/repository/messageRepository';
import {MongoClientFactory} from './util/mongoClientFactory';

// event log
// .Message:
// {
//   "notificationType": "Delivery",
//   "mail": {
//     "timestamp": "2022-05-13T13:43:23.525Z",
//     "source": "develtestbot@gmail.com",
//     "sourceArn": "arn:aws:ses:eu-west-1:696347930245:identity/develtestbot@gmail.com",
//     "sourceIp": "178.255.168.75",
//     "callerIdentity": "Administrator",
//     "sendingAccountId": "696347930245",
//     "messageId": "01020180bda8e285-fa1e82ef-2416-427e-8742-f7292761ed1d-000000",
//     "destination": ["jujobstest@gmail.com"]
//   },
//   "delivery": {
//     "timestamp": "2022-05-13T13:43:24.059Z",
//     "processingTimeMillis": 534,
//     "recipients": ["jujobstest@gmail.com"],
//     "smtpResponse": "250 2.0.0 OK  1652449404 i13-20020a0560001acd00b002061303bdb7si2200803wry.46 - gsmtp",
//     "remoteMtaIp": "74.125.193.26",
//     "reportingMTA": "a4-2.smtp-out.eu-west-1.amazonses.com"
//   }
// }
// shape, bounce types: https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html#

const client = new MongoClientFactory().createConnectedClient();

export const handler = async (event: SNSEvent) => {
  const record = event.Records[0];
  const sesMessage = JSON.parse(record.Sns.Message) as any as SESMessage;
  const sesMessageId = sesMessage.mail.messageId;

  const messageRepository = new MessageRepository(client);

  const message = await messageRepository.findOneByMessageId(sesMessageId);
  if (message === null) {
    console.error(
      `Message with messageId ${sesMessageId} not found! Should be found!`
    );
    console.log(sesMessage);
    return;
  }

  message.feedback(sesMessage);
  await messageRepository.save(message);

  console.log(`SES delivery - var messageId`, sesMessageId);
  console.log(`SES delivery - var message`, sesMessage);
};
