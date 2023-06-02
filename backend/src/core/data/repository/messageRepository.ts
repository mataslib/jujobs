import {Collection, MongoClient} from 'mongodb';
import {Message} from '../../domain/message/message';
import {
  messageCollection,
  MessageDocument,
} from '../collection/messageCollection';

export class MessageRepository {
  client: MongoClient;
  collection: Collection<MessageDocument>;
  constructor(client: MongoClient) {
    this.client = client;
    this.collection = messageCollection(client);
  }

  public async save(message: Message) {
    return this.collection.replaceOne(
      {_id: message._id},
      this.toPersistence(message),
      {
        upsert: true,
      }
    );
  }

  public async findOneByMessageId(messageId: string) {
    return this.collection
      .findOne({response: `${messageId}`})
      .then(persistedData => this.toDomain(persistedData));
  }

  toPersistence(message: Message) {
    const document = {
      ...message,
    };

    return document;
  }

  toDomain(persistedData: MessageDocument | null) {
    if (!persistedData) {
      return persistedData;
    }
    return Message.fromPersisted(persistedData);
  }
}
