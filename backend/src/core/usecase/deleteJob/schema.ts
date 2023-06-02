import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const deleteJobInputSchema = z.object({
  jobId: z.string().transform(val => new ObjectId(val)),
});

export type DeleteJobInput = {
  jobId: string;
};
