import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const getJobInputSchema = z.object({
  jobId: z.string().transform(v => new ObjectId(v)),
});
export type GetJobInput = {
  jobId: string;
};
