import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type MessageDocument = {
  [x: string]: any;
  _id: ObjectId;
};

export const messageCollection = mongoClient
  .db()
  .collection<MessageDocument>('message');
