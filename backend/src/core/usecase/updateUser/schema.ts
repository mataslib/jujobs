import {ObjectId} from 'mongodb';
import {z} from 'zod';
// import {updateUserSchema} from '../../domain/user/schema';

export const updateUserInputSchema = z.object({
  password: z.string().min(8, `Alespoň 8 znaků`),
  userId: z.string().transform(val => new ObjectId(val)),
});

export type UpdateUserInput = {
  userId: string;
  password?: string;
};
