import {ClientSession, Collection, MongoClient} from 'mongodb';
import {EmailChangeRequest} from '../../domain/emailChangeRequest/emailChangeRequest';
import {mongoClient} from '../../service/mongoClient';
import {
  emailChangeRequestCollection,
  EmailChangeRequestDocument,
} from '../collection/emailChangeRequestCollection';

export class EmailChangeRequestRepository {
  client: MongoClient;
  collection: Collection<EmailChangeRequestDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = emailChangeRequestCollection;
  }

  public async save(emailChangeRequest: EmailChangeRequest) {
    return this.collection.updateOne(
      {
        _id: emailChangeRequest._id,
      },
      {$set: this.toPersistance(emailChangeRequest)},
      {
        upsert: true,
      }
    );
  }

  public async delete(
    emailChangeRequest: EmailChangeRequest,
    session?: ClientSession
  ) {
    return this.collection.deleteOne(
      {_id: emailChangeRequest._id},
      {
        session,
      }
    );
  }

  public async findOneByToken(token: string) {
    return this.collection
      .findOne({
        token: token,
      })
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  private toDomain(
    persistedData: EmailChangeRequestDocument
  ): EmailChangeRequest {
    return new EmailChangeRequest(persistedData);
  }

  private toPersistance(
    emailChangeRequest: EmailChangeRequest
  ): EmailChangeRequestDocument {
    return emailChangeRequest;
  }
}

export const emailChangeRequestRepository = new EmailChangeRequestRepository();
