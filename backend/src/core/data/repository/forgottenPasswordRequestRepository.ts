import {Collection, MongoClient} from 'mongodb';
import {ForgottenPasswordRequest} from '../../domain/forgottenPasswordRequest/forgottenPasswordRequest';
import {mongoClient} from '../../service/mongoClient';
import {
  forgottenPasswordRequestCollection,
  ForgottenPasswordRequestDocument,
} from '../collection/forgottenPasswordRequestCollection';

export class ForgottenPasswordRequestRepository {
  client: MongoClient;
  collection: Collection<ForgottenPasswordRequestDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = forgottenPasswordRequestCollection;
  }

  public async save(forgottenPasswordRequest: ForgottenPasswordRequest) {
    return this.collection.updateOne(
      {
        _id: forgottenPasswordRequest._id,
      },
      {$set: this.toPersistance(forgottenPasswordRequest)},
      {
        upsert: true,
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

  toDomain(persistedData: ForgottenPasswordRequestDocument) {
    return new ForgottenPasswordRequest(persistedData);
  }

  toPersistance(
    forgottenPasswordRequest: ForgottenPasswordRequest
  ): ForgottenPasswordRequestDocument {
    return forgottenPasswordRequest;
  }
}

export const forgottenPasswordRequestRepository =
  new ForgottenPasswordRequestRepository();
