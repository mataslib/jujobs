import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type TokenDocument = {
  _id: ObjectId;
  createdAt: Date;
  expiresAt: Date;
  stringToken: string;
  userId: string;
  email: string;
};

export const tokenCollection = mongoClient
  .db()
  .collection<TokenDocument>('token');
