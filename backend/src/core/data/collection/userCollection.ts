import {ObjectId} from 'mongodb';
import {mongoClient} from '../../service/mongoClient';

export type UserDocument = {
  _id: ObjectId;
  email: string;
  password: string;
  passwordSalt: string;
  roles: ('advertiser' | 'admin' | 'student')[];
  advertiserId?: ObjectId | undefined;
  studentId?: ObjectId | undefined;
  createdAt: Date;

  newJobNotificationSubscription?: {
    
  }
};

export const userCollection = mongoClient.db().collection<UserDocument>('user');
