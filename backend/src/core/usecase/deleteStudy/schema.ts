import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const deleteStudyInputSchema = z.object({
  studyId: z.string().transform(val => new ObjectId(val)),
});

export type DeleteStudyInput = {
  studyId: string;
};
