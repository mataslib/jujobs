import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const getAdvertiserInputSchema = z.object({
  advertiserId: z.string().transform(val => new ObjectId(val)),
});
export type GetAdvertiserInput = {
  advertiserId: string;
};
