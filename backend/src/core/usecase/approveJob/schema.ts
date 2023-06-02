import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const approveJobInputSchema = z.object({
  jobId: z.string().transform(val => new ObjectId(val)),
});

export type ApproveJobInput = {
  jobId: string;
};
