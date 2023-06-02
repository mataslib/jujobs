import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const getUserInputSchema = z.object({
  userId: z.string().transform(val => new ObjectId(val)),
});

export type GetUserInput = {
  userId: string;
};
