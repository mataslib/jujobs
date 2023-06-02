import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type EmailChangeRequestDocument = {
  _id: ObjectId;
  token: string;
  userId: ObjectId;
  verifyEmailUrl: string;
  newEmail: string;
};

export const emailChangeRequestCollection = mongoClient
  .db()
  .collection<EmailChangeRequestDocument>('emailChangeRequest');
