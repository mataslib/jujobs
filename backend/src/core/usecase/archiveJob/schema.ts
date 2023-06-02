import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const archiveJobInputSchema = z.object({
  jobId: z.string().transform(val => new ObjectId(val)),
});

export type ArchiveJobInput = {
  jobId: string;
};
