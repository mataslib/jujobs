import {ObjectId} from 'mongodb';

export interface IUser {
  hasRole(): boolean;
  isTestUser(): boolean;
  _id: ObjectId;

  advertiserId?: ObjectId;

  studentId?: ObjectId;
}
