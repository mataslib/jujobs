import {ClientSession, Collection, MongoClient} from 'mongodb';
import {AdvertiserRegistration} from '../../domain/advertiserRegistration/advertiserRegistration';
import {mongoClient} from '../../service/mongoClient';
import {AdvertiserDocument} from '../collection/advertiserCollection';
import {
  advertiserRegistrationCollection,
  AdvertiserRegistrationDocument,
} from '../collection/advertiserRegistrationCollection';

export class AdvertiserRegistrationRepository {
  client: MongoClient;
  collection: Collection<AdvertiserRegistrationDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = advertiserRegistrationCollection;
  }

  public async save(advertiserRegistration: AdvertiserRegistration) {
    return this.collection.updateOne(
      {
        _id: advertiserRegistration._id,
      },
      {
        $set: this.toPersistance(advertiserRegistration),
      },
      {
        upsert: true,
      }
    );
  }

  public async findOneByToken(token: string) {
    return this.collection
      .findOne({token: token})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  public async delete(
    advertiserRegistration: AdvertiserRegistration,
    session?: ClientSession
  ) {
    return this.collection.deleteOne(
      {_id: advertiserRegistration._id},
      {
        session,
      }
    );
  }

  private toDomain(persistedData: AdvertiserRegistrationDocument) {
    return new AdvertiserRegistration(persistedData);
  }

  private toPersistance(
    advertiserRegistration: AdvertiserRegistration
  ): AdvertiserDocument {
    return advertiserRegistration;
  }
}

export const advertiserRegistrationRepository =
  new AdvertiserRegistrationRepository();
