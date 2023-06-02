import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type AdvertiserDocument = {
  _id: ObjectId;
  name: string;
  logo?: string | undefined;
  about?: string | undefined;
  web?: string | undefined;
};

export const advertiserCollection = mongoClient
  .db()
  .collection<AdvertiserDocument>('advertiser');
