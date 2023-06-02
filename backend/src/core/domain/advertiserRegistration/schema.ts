import type {ObjectId} from 'mongodb';

export interface AdvertiserRegistrationProps {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  verifyUrl: string;
  token: string;
  passwordSalt: string;
}

export type CreateAdvertiserRegistrationParams = {
  name: string;
  email: string;
  password: string;
  verifyUrl: string;
};
