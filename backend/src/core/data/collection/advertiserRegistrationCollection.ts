import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type AdvertiserRegistrationDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  passwordSalt: string;
  verifyUrl: string;
  token: string;
  messageId: ObjectId;
};

export const advertiserRegistrationCollection = mongoClient
  .db()
  .collection<AdvertiserRegistrationDocument>('advertiserRegistration');
