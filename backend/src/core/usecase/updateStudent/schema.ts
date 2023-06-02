import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const updateStudentInputSchema = z.object({
  studentId: z.string().transform(val => new ObjectId(val)),
  linkedin: z.string().url().optional(),
  cv: z.string().url().optional(),
});

export type UpdateStudentInput = {
  studentId: string;
  linkedin?: string;
  cv?: string;
};
