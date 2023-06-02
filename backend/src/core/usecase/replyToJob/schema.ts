import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const replyToJobInputSchema = z.object({
  jobId: z.string().transform(val => new ObjectId(val)),
  text: z.string().min(1, `required`),
  attachStudentProfile: z.boolean(),
});

export type ReplyToJobInput = {
  jobId: string;
  text: string;
  attachStudentProfile: boolean;
};
