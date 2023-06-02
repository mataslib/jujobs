import {ObjectId} from 'mongodb';

export interface AdvertiserProps {
  _id: ObjectId;
  name: string;
  logo?: string;
  about?: string;
  web?: string;
}

export type UpdateParams = {
  name?: string;
  logo?: string | null;
  about?: string | null;
  web?: string | null;
};
