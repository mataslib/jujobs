import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const getNewJobNotificationConfigInputSchema = z.object({
  userId: z.string().transform(val => new ObjectId(val)),
});
export type GetNewJobNotificationConfigInput = {
  userId: string;
};
