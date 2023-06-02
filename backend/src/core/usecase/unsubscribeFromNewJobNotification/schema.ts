import {ObjectId} from 'mongodb';
import {z} from 'zod';
export const unsubscribeFromNewJobNotificationInputSchema = z.object({
  userId: z.string().transform(val => new ObjectId(val)),
});

export type UnsubscribeFromNewJobNotificationInput = {
  userId: string;
};
