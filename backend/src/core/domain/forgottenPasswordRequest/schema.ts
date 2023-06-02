import {ObjectId} from 'mongodb';

export interface ForgottenPasswordRequestProps {
  _id: ObjectId;
  token: string;
  userId: ObjectId;
  changePasswordUrl: string;
}

export type CreateParams = {
  userId: ObjectId;
  changePasswordUrl: string;
};
