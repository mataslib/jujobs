import {ObjectId} from 'mongodb';

export interface MessageData {
  _id: ObjectId;
  [key: string]: any;
}
