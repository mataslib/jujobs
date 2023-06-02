import {ClientSession, Collection, MongoClient, ObjectId} from 'mongodb';
import {User} from '../../domain/user/user';
import {mongoClient} from '../../service/mongoClient';
import {userCollection, UserDocument} from '../collection/userCollection';

export class UserRepository {
  client: MongoClient;
  collection: Collection<UserDocument>;

  constructor() {
    this.client = mongoClient;
    this.collection = userCollection;
  }

  public async save(user: User, session?: ClientSession) {
    return this.collection.updateOne(
      {_id: user._id},
      {$set: this.toPersistence(user)},
      {
        upsert: true,
        session,
      }
    );
  }

  public async findOneById(id: ObjectId) {
    return this.collection
      .findOne({_id: id})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  public async findOneByEmail(email: string) {
    return this.collection
      .findOne({email})
      .then(doc => (doc ? this.toDomain(doc) : null));
  }

  toPersistence(user: User): UserDocument {
    return user;
  }

  toDomain(persistedData: UserDocument) {
    return new User(persistedData);
  }
}

export const userRepository = new UserRepository();
