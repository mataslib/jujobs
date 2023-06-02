import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type ForgottenPasswordRequestDocument = {
  _id: ObjectId;
  token: string;
  userId: ObjectId;
  changePasswordUrl: string;
};

export const forgottenPasswordRequestCollection = mongoClient
  .db()
  .collection<ForgottenPasswordRequestDocument>('forgottenPasswordRequest');
