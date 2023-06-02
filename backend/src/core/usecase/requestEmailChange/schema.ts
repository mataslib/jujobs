import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const requestEmailChangeInputSchema = z.object({
  userId: z.string().transform(val => new ObjectId(val)),
  newEmail: z.string().email(),
  verifyEmailUrl: z.string().url(),
});

export type RequestEmailChangeInput = {
  userId: string;
  newEmail: string;
  verifyEmailUrl: string;
};
