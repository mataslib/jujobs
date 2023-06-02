import {ObjectId} from 'mongodb';
import {z} from 'zod';

export const getStudentInputSchema = z.object({
  studentId: z.string().transform(val => new ObjectId(val)),
});
export type GetStudentInput = {
  studentId: string;
};
