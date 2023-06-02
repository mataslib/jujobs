import type {ObjectId} from 'mongodb';

export interface EmailChangeRequestProps {
  _id: ObjectId;
  token: string;
  userId: ObjectId;
  verifyEmailUrl: string;
  newEmail: string;
}

export type CreateEmailChangeRequestParams = {
  userId: ObjectId;
  verifyEmailUrl: string;
  newEmail: string;
};
